<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://w3.org" xmlns:s="http://sitemaps.org">
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap XML</title>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; background: #fff; }
          th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
          th { background: #007bff; color: white; }
          tr:nth-child(even) { background: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Sitemap Website Tunggal Paito</h2>
        <table>
          <tr><th>URL</th><th>Terakhir Diubah</th><th>Frekuensi</th><th>Prioritas</th></tr>
          <xsl:for-each select="s:urlset/s:url">
            <tr>
              <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
              <td><xsl:value-of select="s:lastmod"/></td>
              <td><xsl:value-of select="s:changefreq"/></td>
              <td><xsl:value-of select="s:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
