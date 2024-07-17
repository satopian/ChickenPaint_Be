.PHONY: test blending-bench blending-test dist all min tools

ENGINE_SOURCE = js/engine/* js/util/*

all :clean chickenpaint cat_all cat_min 
chickenpaint:temp/chickenpaint.temp.js
cat_all: resources/js/chickenpaint.js
cat_min: resources/js/chickenpaint.min.js
# dist: all min chickenpaint.zip

ifdef OSASCRIPT
	osascript -e 'display notification "Build successful" with title "ChickenPaint build complete"'
endif

# min : resources/js/chickenpaint.min.js

temp/chickenpaint.temp.js : js/engine/* js/gui/* js/util/* js/languages/* js/ChickenPaint.js js/engine/CPBlend.js lib/*
	mkdir -p temp/
	node_modules/.bin/browserify --standalone ChickenPaint --debug --entry js/ChickenPaint.js --transform babelify | node_modules/.bin/exorcist $@.map > $@

test: thumbnail-test integration-test blending-test

tools: blending-bench blending-compare

blending-bench: test/blending/bench/blending.js
blending-compare: test/blending/test/blending.js

thumbnail-test: test/thumbnail_test/thumbnail.js
integration-test: test/integration_test/integration.js

test/blending/compare/blending.js : js/engine/CPBlend.js js/engine/CPBlend2.js test/blending/compare/blending.es6.js $(ENGINE_SOURCE)
	node_modules/.bin/browserify --standalone BlendingTest --outfile $@ -d -e test/blending/compare/blending.es6.js -t babelify

test/blending/bench/blending.js : js/engine/CPBlend.js js/engine/CPBlend2.js test/blending/bench/blending.es6.js $(ENGINE_SOURCE)
	node_modules/.bin/browserify --standalone BlendingBench --outfile $@ -d -e test/blending/bench/blending.es6.js -t babelify

test/thumbnail_test/thumbnail.js : js/engine/CPImageLayer.js js/engine/CPColorBmp.js test/thumbnail_test/thumbnail.es6.js $(ENGINE_SOURCE)
	node_modules/.bin/browserify --standalone ThumbnailTest --outfile $@ -d -e test/thumbnail_test/thumbnail.es6.js -t babelify

test/integration_test/integration.js : test/integration_test/integration.es6.js $(ENGINE_SOURCE)
	node_modules/.bin/browserify --standalone IntegrationTest --outfile $@ -d -e test/integration_test/integration.es6.js -t babelify

js/engine/CPBlend2.js :
	touch js/engine/CPBlend2.js

js/engine/CPBlend.js : codegenerator/BlendGenerator.js
	node codegenerator/BlendGenerator.js > js/engine/CPBlend.js

resources/js/chickenpaint.js: header/header.txt node_modules/bootstrap/dist/js/bootstrap.bundle.min.js temp/chickenpaint.temp.js
	mkdir -p resources/js/
	cat header/header.txt > resources/js/chickenpaint.js
	printf "\n" >> resources/js/chickenpaint.js
	cat node_modules/bootstrap/dist/js/bootstrap.bundle.min.js >> resources/js/chickenpaint.js
	printf "\n" >> resources/js/chickenpaint.js
	cat temp/chickenpaint.temp.js >> resources/js/chickenpaint.js	
resources/js/chickenpaint.min.js: header/header.txt resources/js/chickenpaint.js
	mkdir -p temp
	google-closure-compiler --js resources/js/chickenpaint.js --js_output_file temp/chickenpaint.temp.min.js
	cat header/header.txt temp/chickenpaint.temp.min.js > resources/js/chickenpaint.min.js
clean :
	rm -rf temp/
	rm -f resources/js/chickenpaint{.js,.js.map} resources/js/chickenpaint.min{.js,.js.map}
	rm -f test/blending_bench/blending_test.js test/blending_bench/blending.js test/integration_test/integration.js js/engine/CPBlend.js
