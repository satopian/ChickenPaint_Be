.PHONY: test blending-bench blending-test dist all min tools

ENGINE_SOURCE = js/engine/* js/util/*

all :clean build cat_min 
build:temp/ChickenPaint.js
dev: dev_clear dist/index.html
cat_min:resources/js/chickenpaint.min.js

ifdef OSASCRIPT
	osascript -e 'display notification "Build successful" with title "ChickenPaint build complete"'
endif

temp/ChickenPaint.js : js/engine/* js/gui/* js/util/* js/languages/* js/ChickenPaint.js js/engine/CPBlend.js lib/*
	mkdir -p temp/
	node_modules/.bin/parcel build js/ChickenPaint.js --no-source-maps --no-cache --dist-dir ./temp

dist/index.html : js/engine/* js/gui/* js/util/* js/languages/* js/ChickenPaint.js js/engine/CPBlend.js lib/*
	mkdir -p dist/
	node_modules/.bin/parcel index.html  --no-cache
dev_clear :
	rm -rf dist/
	rm -rf .parcel-cache/

test: thumbnail-test integration-test blending-test

tools: blending-bench blending-compare

blending-bench: test/blending/bench/blending.js
blending-compare: test/blending/test/blending.js

thumbnail-test: test/thumbnail_test/thumbnail.js
integration-test: test/integration_test/integration.js

js/engine/CPBlend2.js :
	touch js/engine/CPBlend2.js

js/engine/CPBlend.js : codegenerator/BlendGenerator.js
	node codegenerator/BlendGenerator.js > js/engine/CPBlend.js

resources/js/chickenpaint.min.js: header/header.txt temp/ChickenPaint.js
	mkdir -p resources/js/
	google-closure-compiler --js temp/ChickenPaint.js --js_output_file temp/chickenpaint.min.js
	cat header/header.txt temp/chickenpaint.min.js > resources/js/chickenpaint.min.js
	cp resources/js/chickenpaint.min.js resources/js/chickenpaint.js
	rm -rf temp/

clean :
	rm -rf .parcel-cache
	rm -rf temp/
	rm -rf resources/js/
	rm -f test/blending_bench/blending_test.js test/blending_bench/blending.js test/integration_test/integration.js js/engine/CPBlend.js
