"""Recover the original engineering grids from the archived main layouts.

This optional authoring tool needs Beautiful Soup. The site build itself uses
only Node and the generated JSON; text and media still come from content.json.
"""
from pathlib import Path
import json
import re
from bs4 import BeautifulSoup

SLUGS = ["autopasser", "automated-gripper", "copy-of-autopasser",
         "copy-of-automated-gripper", "apple", "sageware", "endless-garden"]
LAYOUT = set("position display width height min-width min-height max-width max-height margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right left right top bottom grid-area grid-template-columns grid-template-rows grid-column grid-row align-self justify-self align-items justify-content flex flex-grow flex-shrink flex-basis flex-direction flex-wrap order gap column-gap row-gap box-sizing transform transform-origin".split())


def declarations(body):
    return dict((key.strip(), value.strip()) for key, value in
                (part.split(":", 1) for part in body.split(";") if ":" in part))


def extract(page):
    slug = page["slug"]
    soup = BeautifulSoup(Path(f"src/layouts/{slug}.html").read_text(), "html.parser")
    main = soup.find("main")
    css = Path(f"src/layouts/{slug}.css").read_text()
    colors = dict(re.findall(r"(--color_\d+):\s*([\d ,]+);", css))
    ids, meshes, placement, classes = {}, {}, {}, {}
    for selector, body in re.findall(r"([^{}]+)\{([^{}]*)\}", css):
        props = declarations(body)
        for sel in selector.split(", "):
            sel = sel.strip()
            match = re.fullmatch(r"#([\w-]+)", sel)
            if match:
                ids.setdefault(match[1], {}).update(props)
            match = re.fullmatch(r"\.([\w-]+)", sel)
            if match:
                classes.setdefault(match[1], {}).update(props)
            match = re.fullmatch(r'\[data-mesh-id=[\"\']?([^\]\"\']+)[\"\']?\]', sel)
            if match:
                meshes.setdefault(match[1], {}).update(props)
        match = re.search(r'\[data-mesh-id=[\"\']?([^\]\"\']+)[\"\']?\]\s*>\s*\[id="([^"]+)"\]', selector)
        if match:
            placement.setdefault((match[1], match[2]), {}).update(props)

    leaves = {}
    for index, node in enumerate(page["nodes"]):
        if node["type"] == "anchor":
            continue
        source_id = node["id"]
        element_id = source_id.removeprefix("img_") if node["type"] == "image" else source_id
        element = main.find(id=element_id) if element_id else None
        if node["type"] == "link" and element is None:
            link = main.find("a", href=node["href"])
            element = next((p for p in [link, *link.parents] if p.get("id")), None) if link else None
        if element is None:
            raise ValueError(f"{slug}: missing source node {source_id or node.get('href')}")
        leaves[id(element)] = index

    serial = 0

    def visit(element, parent_mesh=None):
        nonlocal serial
        if not getattr(element, "name", None):
            return []
        element_id = element.get("id", "")
        mesh = element.get("data-mesh-id")
        if element_id.startswith(("bgLayers_", "bgMedia_")):
            return []
        props = {}
        for class_name in element.get("class", []):
            props.update(classes.get(class_name, {}))
        if parent_mesh:
            props.update(placement.get((parent_mesh, element_id), {}))
        for key, value in ids.get(element_id, {}).items():
            props.pop(key, None)
            props[key] = value
        if mesh:
            props.update(meshes.get(mesh, {}))
        props.update(declarations(element.get("style", "")))
        style = {k: v for k, v in props.items() if k in LAYOUT and not (k == "position" and v in ["fixed", "absolute"])}
        original_classes = element.get("class", [])
        if "wixui-column-strip" in original_classes:
            style["display"] = "flex"
        if "Ak0vpt" in original_classes:
            style.update({"display": "flex", "width": "100%", "position": "relative"})
        if "wixui-column-strip__column" in original_classes:
            style.update({"flex": "1 1 0%", "min-width": "0"})
        if "--min-height" in props:
            style["min-height"] = props["--min-height"]
        # Source component variables are reduced to ordinary CSS values.
        variables = {k: v for k, v in props.items() if k.startswith("--")}
        variables["--site-width"] = "980px"
        for _ in range(3):
            style = {k: re.sub(r"var\((--[\w-]+)\)", lambda m: variables.get(m[1], m[0]), v) for k, v in style.items()}
        style = {k: v for k, v in style.items() if "var(" not in v}
        background = props.get("--bg-overlay-color")
        if background:
            background = re.sub(r"var\((--color_\d+)\)", lambda m: colors.get(m[1], "255,255,255"), background)
        is_panel = "wixui-box" in element.get("class", []) or "--rd" in props
        if is_panel and "--bg" in props:
            background = f"rgba({props['--bg']},{props.get('--alpha-bg', '1')})"
        node = {"key": f"e{serial}", "style": style}
        serial += 1
        if element_id:
            node["id"] = element_id
        if background and background != "transparent":
            node["background"] = background
        if is_panel:
            node["panel"] = True
            node["radius"] = props.get("--rd", "30px")
        if id(element) in leaves:
            source = page["nodes"][leaves[id(element)]]
            node["source"] = source["id"] or "link:" + source["href"]
            node.pop("background", None)
            if source["type"] == "text":
                presentations = []
                for block in element.find_all(["h1", "h2", "h3", "h4", "h5", "p", "ul", "ol", "li"]):
                    presentation = declarations(block.get("style", ""))
                    presentation.pop("font-family", None)
                    if block.name in ["h2", "h3"]:
                        presentation.setdefault("font-weight", "400")
                    if block.name not in ["ul", "ol", "li"]:
                        base = presentation.get("font-size", {"h1": "50px", "h2": "30px", "h3": "24px", "h5": "14px"}.get(block.name, "16px"))
                        sizes = set()
                        for text in block.find_all(string=True):
                            if not text.strip().strip("\u200b\u200c\u200d"):
                                continue
                            size = base
                            ancestors = []
                            for ancestor in text.parents:
                                if ancestor is block:
                                    break
                                ancestors.append(ancestor)
                            for ancestor in reversed(ancestors):
                                size = declarations(ancestor.get("style", "")).get("font-size", size)
                            sizes.add(size)
                        if len(sizes) == 1 and next(iter(sizes)) != base:
                            presentation["font-size"] = next(iter(sizes))
                            if "line-height" not in presentation and base.endswith("px"):
                                presentation["line-height"] = str(float(base[:-2]) * 1.4) + "px"
                    presentations.append({"tag": block.name, "style": presentation})
                node["textStyles"] = presentations
            return [node]
        if "wixui-horizontal-line" in element.get("class", []):
            node["rule"] = True
            node["lineWidth"] = props.get("--lnw", "2px")
            color = re.sub(r"var\((--color_\d+)\)", lambda m: colors.get(m[1], "170,170,170"), props.get('--brd', '170,170,170'))
            node["lineColor"] = f"rgba({color},{props.get('--alpha-brd', '1')})"
            return [node]
        if "wixui-vector-image" in original_classes and element.find("svg"):
            node["svg"] = str(element.find("svg"))
            return [node]
        children = []
        for child in element.children:
            children.extend(visit(child, mesh if mesh and mesh.endswith("-gridContainer") else None))
        is_spacer = mesh and "wedge" in mesh
        if not children and not is_spacer:
            return []
        if is_spacer:
            node["spacer"] = True
        if mesh and mesh.endswith("-gridContainer"):
            node["grid"] = True
        if element.name == "section":
            node["section"] = True
        node["children"] = children
        if not element_id and not style and not mesh and not node.get("section"):
            return children
        return [node]

    tree = []
    for child in main.children:
        tree.extend(visit(child))
    return tree


pages = json.loads(Path("src/content.json").read_text())
result = {slug: extract(next(p for p in pages if p["slug"] == slug)) for slug in SLUGS}
Path("src/engineering-layouts.json").write_text(json.dumps(result, indent=2) + "\n")
print("Recovered original grids for " + ", ".join(result))
