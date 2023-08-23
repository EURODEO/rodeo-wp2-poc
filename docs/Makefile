FILE_BASENAME=rodeo-wp2-poc

html:
	asciidoctor --verbose --trace -o ${FILE_BASENAME}.html index.adoc

pdf:
	asciidoctor --verbose --trace -r asciidoctor-pdf --trace -b pdf -o ${FILE_BASENAME}.pdf index.adoc

docx:
	asciidoctor --verbose --trace --backend docbook --out-file - index.adoc | pandoc --from docbook --to docx --output ${FILE_BASENAME}.docx

clean:
	rm -f ${FILE_BASENAME}.html ${FILE_BASENAME}.pdf ${FILE_BASENAME}.docx

.PHONY: html pdf docx linkcheck clean
