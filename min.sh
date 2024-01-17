mkdir -p dest/temp/
google-closure-compiler --js dest/chickenpaint.js --js_output_file dest/temp/temp.min.js
cat "bootstrap/js/header.txt" "dest/temp/temp.min.js" > "dest/chickenpaint.min.js"