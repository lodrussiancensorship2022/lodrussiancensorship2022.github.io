from lxml import etree

TEI_NS = "http://www.tei-c.org/ns/1.0"
NS = {"tei": TEI_NS}

PREFIXES = """@base <https://w3id.org/russiancensorshiplod/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix schema: <https://schema.org/> .
@prefix crm: <http://www.cidoc-crm.org/cidoc-crm/> .
@prefix bibo: <http://purl.org/ontology/bibo/> .
@prefix aio: <https://w3id.org/agreements-ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"""

def parse_tei(xml_path="tei.xml"):
    return etree.parse(xml_path).getroot()

def idno_triple(idno_type, val):
    val = val.strip()
    if idno_type == "wikidata":
        q = val.replace("wikidata:", "")
        return ("wikidata", f"    owl:sameAs <https://www.wikidata.org/wiki/{q}>")
    elif idno_type == "viaf":
        v = val.replace("viaf:", "")
        return ("viaf", f"    owl:sameAs <https://viaf.org/viaf/{v}>")
    elif idno_type == "loc":
        l = val.replace("loc:", "")
        return ("loc", f"    owl:sameAs <https://id.loc.gov/authorities/{l}>")
    elif idno_type == "isni":
        i = val.replace("isni:", "")
        return ("isni", f"    owl:sameAs <https://isni.org/isni/{i}>")
    return None

def render_block(uri, rdf_type, properties, sameAs_list):
    """
    Render a Turtle block.
    properties: list of (predicate, object) strings
    sameAs_list: list of (source_label, triple_string)
    """
    lines = []
    all_props = []
    if rdf_type:
        all_props.append(f"a {rdf_type}")
    for pred, obj in properties:
        all_props.append(f"{pred} {obj}")
    for label, triple in sameAs_list:
        all_props.append((label, triple))

    # Build lines
    first = True
    for i, item in enumerate(all_props):
        is_last = (i == len(all_props) - 1)
        sep = " ." if is_last else " ;"
        if isinstance(item, tuple):
            label, triple = item
            comment = f" #{label.upper()}" if label in ("wikidata","viaf","loc","isni") else ""
            comment_map = {"wikidata": "#Wikidata", "viaf": "#VIAF", "loc": "#LCSH", "isni": "#ISNI"}
            comment = f" {comment_map.get(label, '')}"
            if first:
                lines.append(f"{uri} {triple.strip()}{sep} {comment}".rstrip())
                first = False
            else:
                lines.append(f"{triple}{sep} {comment}".rstrip())
        else:
            if first:
                lines.append(f"{uri} {item}{sep}")
                first = False
            else:
                lines.append(f"    {item}{sep}")
    return lines

def extract_persons(root):
    out = []
    for person in root.findall(".//tei:particDesc/tei:listPerson/tei:person", NS):
        pid = person.get("{http://www.w3.org/XML/1998/namespace}id")
        if not pid:
            continue
        occ_el = person.find("tei:occupation", NS)
        occ = occ_el.text.strip() if occ_el is not None else ""
        idnos = person.findall("tei:idno", NS)

        props = []
        if occ:
            props.append(("schema:jobTitle", f'"{occ}"'))

        sameAs = []
        for idno in idnos:
            r = idno_triple(idno.get("type"), idno.text or "")
            if r:
                sameAs.append(r)

        lines = render_block(f"<item/{pid}>", "crm:E21_Person", props, sameAs)
        out.extend(lines)
        out.append("")
    return out

def extract_orgs(root):
    out = []
    for org in root.findall(".//tei:particDesc/tei:listOrg/tei:org", NS):
        oid = org.get("{http://www.w3.org/XML/1998/namespace}id")
        if not oid:
            continue
        idnos = org.findall("tei:idno", NS)
        sameAs = []
        for idno in idnos:
            r = idno_triple(idno.get("type"), idno.text or "")
            if r:
                sameAs.append(r)
        lines = render_block(f"<org/{oid}>", "crm:E74_Group", [], sameAs)
        out.extend(lines)
        out.append("")
    return out

def extract_events(root):
    out = []
    for event in root.findall(".//tei:settingDesc/tei:listEvent/tei:event", NS):
        eid = event.get("{http://www.w3.org/XML/1998/namespace}id")
        if not eid:
            continue
        idnos = event.findall("tei:idno", NS)
        sameAs = []
        for idno in idnos:
            r = idno_triple(idno.get("type"), idno.text or "")
            if r:
                sameAs.append(r)
        lines = render_block(f"<item/{eid}>", "crm:E5_Event", [], sameAs)
        out.extend(lines)
        out.append("")
    return out

def extract_legislation(root):
    out = []
    for law in root.findall(".//tei:rs[@type='legislation']", NS):
        lid = law.get("{http://www.w3.org/XML/1998/namespace}id")
        corresp = law.get("corresp", "")
        if not lid:
            continue
        sameAs = []
        if corresp:
            q = corresp.replace("wikidata:", "")
            sameAs.append(("wikidata", f"    owl:sameAs <https://www.wikidata.org/wiki/{q}>"))
        lines = render_block(f"<item/{lid}>", "aio:Law", [], sameAs)
        out.extend(lines)
        out.append("")
    return out

def extract_documents(root):
    out = []
    for doc in root.findall(".//tei:rs[@type='document']", NS):
        did = doc.get("{http://www.w3.org/XML/1998/namespace}id")
        corresp = doc.get("corresp", "")
        if not did:
            continue
        rdf_type = "bibo:LegalDocument" if "echr" in did.lower() else "bibo:Report"
        props = []
        if corresp:
            props.append(("dcterms:identifier", f'"{corresp}"'))
        lines = render_block(f"<item/{did}>", rdf_type, props, [])
        out.extend(lines)
        out.append("")
    return out

def main():
    root = parse_tei()
    sections = [
        ("# PERSONS — extracted from TEI persName annotations", extract_persons(root)),
        ("# ORGANISATIONS — extracted from TEI orgName annotations", extract_orgs(root)),
        ("# EVENTS — extracted from TEI rs[@type='event'] annotations", extract_events(root)),
        ("# LEGISLATION — extracted from TEI rs[@type='legislation'] annotations", extract_legislation(root)),
        ("# DOCUMENTS — extracted from TEI rs[@type='document'] annotations", extract_documents(root)),
    ]

    result = [PREFIXES]
    for header, triples in sections:
        result.append("\n" + header + "\n")
        result.extend(triples)

    with open("rdf_from_tei.ttl", "w", encoding="utf-8") as f:
        f.write("\n".join(result))
    print("RDF output written to rdf_from_tei.ttl")

if __name__ == "__main__":
    main()