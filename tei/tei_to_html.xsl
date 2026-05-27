<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  exclude-result-prefixes="tei">

  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-public="-//W3C//DTD HTML 4.01//EN"/>

  <!-- ROOT -->
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Russian 2022 War Censorship Laws – TEI Edition</title>
        <style>
          body {
            font-family: Georgia, serif;
            max-width: 860px;
            margin: 40px auto;
            padding: 0 20px;
            color: #1a1a1a;
            line-height: 1.75;
          }
          h1 { font-size: 2em; border-bottom: 2px solid #8b0000; padding-bottom: 10px; }
          h2 { font-size: 1.4em; color: #8b0000; margin-top: 2em; }
          h3 { font-size: 1.1em; color: #555; }
          p { margin: 1em 0; }
          .persName {
            color: #8b0000;
            font-weight: bold;
            border-bottom: 1px dotted #8b0000;
            cursor: help;
          }
          .orgName {
            color: #003366;
            font-weight: bold;
            border-bottom: 1px dotted #003366;
            cursor: help;
          }
          .event {
            color: #2e6b2e;
            font-style: italic;
            border-bottom: 1px dotted #2e6b2e;
            cursor: help;
          }
          .legislation {
            color: #7a4000;
            font-weight: bold;
            border-bottom: 1px dotted #7a4000;
          }
          .document {
            color: #555;
            font-style: italic;
          }
          .legend {
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
            font-size: 0.9em;
          }
          .legend h3 { margin-top: 0; color: #333; }
          .legend span { display: inline-block; margin-right: 20px; margin-bottom: 5px; }
          .source {
            font-size: 0.85em;
            color: #888;
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="//tei:titleStmt/tei:title"/></h1>

        <div class="legend">
          <h3>Annotation Legend</h3>
          <span><span class="persName">Person</span></span>
          <span><span class="orgName">Organisation</span></span>
          <span><span class="event">Event</span></span>
          <span><span class="legislation">Legal instrument</span></span>
          <span><span class="document">Document</span></span>
        </div>

        <xsl:apply-templates select="//tei:body"/>

        <div class="source">
          <p>Source: <a href="https://en.wikipedia.org/wiki/Russian_2022_war_censorship_laws"
            target="_blank">Wikipedia – Russian 2022 war censorship laws</a></p>
          <p>TEI encoding: Russian Censorship LOD Project – University of Bologna, a.y. 2025–2026</p>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- BODY -->
  <xsl:template match="tei:body">
    <xsl:apply-templates/>
  </xsl:template>

  <!-- DIV -->
  <xsl:template match="tei:div">
    <div>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- HEAD -->
  <xsl:template match="tei:div[@type='article']/tei:head">
    <h1><xsl:apply-templates/></h1>
  </xsl:template>

  <xsl:template match="tei:div/tei:div/tei:head">
    <h3><xsl:apply-templates/></h3>
  </xsl:template>

  <xsl:template match="tei:div/tei:head">
    <h2><xsl:apply-templates/></h2>
  </xsl:template>

  <!-- PARAGRAPH -->
  <xsl:template match="tei:p">
    <p><xsl:apply-templates/></p>
  </xsl:template>

  <!-- PERSON -->
  <xsl:template match="tei:persName">
    <span class="persName">
      <xsl:attribute name="title">
        <xsl:text>Person: </xsl:text>
        <xsl:value-of select="."/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <!-- ORGANISATION -->
  <xsl:template match="tei:orgName">
    <span class="orgName">
      <xsl:attribute name="title">
        <xsl:text>Organisation: </xsl:text>
        <xsl:value-of select="."/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <!-- RS TYPE EVENT -->
  <xsl:template match="tei:rs[@type='event']">
    <span class="event">
      <xsl:attribute name="title">
        <xsl:text>Event: </xsl:text>
        <xsl:value-of select="."/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <!-- RS TYPE LEGISLATION -->
  <xsl:template match="tei:rs[@type='legislation']">
    <span class="legislation">
      <xsl:attribute name="title">
        <xsl:text>Legal instrument: </xsl:text>
        <xsl:value-of select="."/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <!-- RS TYPE DOCUMENT -->
  <xsl:template match="tei:rs[@type='document']">
    <span class="document">
      <xsl:attribute name="title">
        <xsl:text>Document: </xsl:text>
        <xsl:value-of select="."/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

</xsl:stylesheet>
