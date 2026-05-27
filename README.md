# Russian Censorship Policy 2022 — Linked Open Data Project

A Linked Open Data project documenting the legal, political, and human consequences of the Russian war censorship laws enacted on 4 March 2022.

**Live site:** https://lodrussiancensorship2022.github.io/

---

## Project Structure

```text
LOD/
├── index.html                        # Main site
├── style.css                         # Global styles
├── script.js                         # Frontend interactions and visualisation scripts
├── rdf.ttl                           # RDF serialisation in Turtle format
├── README.md

├── tei/                              # TEI/XML production workflow
│   ├── tei.xml                       # TEI/XML encoded source document
│   ├── tei_to_html.xsl               # XSLT stylesheet
│   ├── tei.html                      # HTML generated from TEI/XML
│   ├── xml_to_html.py                # Python: XML → HTML transformation
│   └── xml_to_rdf.py                 # Python: XML → RDF conversion

├── img/                              # Images and visual assets
│   └── *.png

├── graphs/                           # Interactive graph visualisations
    └── *.html

└── data/                             # Source datasets in CSV format
    └── *.csv
```

---

## Dataset

**Wikipedia page:**
Russian 2022 war censorship laws

**Domain:**
Russian censorship policy (2022–present)

**Items:**
11 selected entities

**Base URI:**
`https://w3id.org/russiancensorshiplod/`


---

## Ontologies Used

| Prefix     | Ontology               | Purpose                                                    |
| ---------- | ---------------------- | ---------------------------------------------------------- |
| `crm:`     | CIDOC-CRM              | Events, persons, organisations, complex semantic relations |
| `dcterms:` | Dublin Core Terms      | Bibliographic and descriptive metadata                     |
| `schema:`  | Schema.org             | Person and organisation attributes                         |
| `bibo:`    | Bibliographic Ontology | Document and publication types                             |
| `aio:`     | Agreements Ontology    | Legal instruments and laws                                 |

---

## Authority Files Linked

| Authority File      | Linked Items |
| ------------------- | ------------ |
| Wikidata            | 9            |
| VIAF                | 6            |
| Library of Congress | 3            |
| ISNI                | 2            |

---

## Data Files

The `data/` folder contains the source CSV datasets used throughout the Knowledge Organization and Knowledge Representation workflows.

| File                    | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `Items.csv`             | Selected entities with descriptions and authority identifiers |
| `ConceptualMap.csv`     | Subject–predicate–object statements in natural language       |
| `ERModel.csv`           | Abstract Entity–Relationship representation                   |
| `TheoreticalModel.csv`  | Extended semantic model with additional properties            |
| `EnhancedERModel.csv`   | Updated E/R structure derived from the theoretical model      |
| `MetadataAnalysis.csv`  | Metadata standards assigned to the entities                   |
| `MetadataAlignment.csv` | Crosswalk and alignment between metadata standards            |
| `ConceptualModel.csv`   | Ontological model using controlled vocabularies               |
| `ItemsDescription.csv`  | RDF-ready entity descriptions with ontology terms             |
| `URIProduction.csv`     | URI definitions for all entities                              |

---

## TEI/XML Production

The project includes a TEI/XML workflow used to encode and transform the source material into structured semantic formats.

The TEI production pipeline consists of:

* `tei.xml` — TEI/XML encoded source document
* `tei_to_html.xsl` — XSLT stylesheet for XML-to-HTML transformation
* `tei.html` — generated HTML representation
* `xml_to_html.py` — Python script for TEI/XML to HTML conversion
* `xml_to_rdf.py` — Python script for TEI/XML to RDF conversion

The TEI representation complements the RDF dataset by preserving a hierarchical document-oriented structure while supporting semantic interoperability and transformation workflows.

---

## RDF Serialisation

The complete RDF dataset is available as `rdf.ttl` in Turtle format.

The RDF graph was modelled using CIDOC-CRM, Dublin Core Terms, Schema.org, BIBO, and Agreements Ontology. External authority links are provided through `owl:sameAs` relations to Wikidata, VIAF, ISNI, and Library of Congress identifiers.