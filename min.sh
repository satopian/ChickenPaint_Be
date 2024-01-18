mkdir -p temp
google-closure-compiler --js dest/chickenpaint.js --js_output_file temp/chickenpaint.temp.min.js
cat "bootstrap/js/header.txt" "temp/chickenpaint.temp.min.js" > "dest/chickenpaint.min.js"