<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap XML - Tunggal Paito</title>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
          th { background: #007bff; color: white; }
          tr:nth-child(even) { background: #f2f2f2; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h2>Sitemap Website Tunggal Paito</h2>
        <table>
          <tr>
            <th>URL</th>
            <th>Terakhir Diubah</th>
          </tr>
          <xsl:for-each select="s:urlset/s:url">
            <tr>
              <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
              <td><xsl:value-of select="s:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
