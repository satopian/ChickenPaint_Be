.PHONY: test blending-bench blending-test dist all min tools

ENGINE_SOURCE = js/engine/* js/util/*

all :clean build cat_min 
build:temp/ChickenPaint.js
cat_min:chickenpaint/js/chickenpaint.min.js
dev: clean_dist dist/index.html
format:
	npx prettier --write "js/**/*.js"
ifdef OSASCRIPT
	osascript -e 'display notification "Build successful" with title "ChickenPaint build complete"'
endif

temp/ChickenPaint.js : js/engine/* js/gui/* js/util/* js/languages/* js/ChickenPaint.js js/engine/CPBlend.js lib/*
	mkdir -p temp/
	@BUILD_TIME=$$(date -u +"%Y-%m-%dT%H:%M:%S") node_modules/.bin/parcel build js/ChickenPaint.js --no-source-maps --no-cache --dist-dir ./temp

dist/index.html : js/engine/* js/gui/* js/util/* js/languages/* js/ChickenPaint.js js/engine/CPBlend.js lib/*
	mkdir -p dist/
	@BUILD_TIME=$$(date -u +"%Y-%m-%dT%H:%M:%S") node_modules/.bin/parcel index.html  --no-cache
clean_dist :
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

chickenpaint/js/chickenpaint.min.js: header/header.txt temp/ChickenPaint.js
	mkdir -p chickenpaint/js/
	./node_modules/.bin/google-closure-compiler --js temp/ChickenPaint.js --js_output_file temp/chickenpaint.min.js
	cat header/header.txt temp/chickenpaint.min.js > chickenpaint/js/chickenpaint.min.js
	cp chickenpaint/js/chickenpaint.min.js chickenpaint/js/chickenpaint.js
	rm -rf temp/

clean :
	rm -rf .parcel-cache
	rm -rf temp/
	rm -rf chickenpaint/js/
	rm -f test/blending_bench/blending_test.js test/blending_bench/blending.js test/integration_test/integration.js js/engine/CPBlend.js
