# makefile to automatize simple operations

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~

build:	minifyCore minifyBundle

buildCore: 
	echo				 > build/fireworks.js
	cat src/core.js			>> build/fireworks.js
	cat src/effect.js		>> build/fireworks.js
	cat src/emitter.js		>> build/fireworks.js
	cat src/lineargradient.js	>> build/fireworks.js
	cat src/particle.js		>> build/fireworks.js
	cat src/shape.js		>> build/fireworks.js
	cat src/vector.js		>> build/fireworks.js

minifyCore: buildCore
	curl --data-urlencode "js_code@build/fireworks.js" 	\
		-d "output_format=text&output_info=compiled_code&compilation_level=SIMPLE_OPTIMIZATIONS" \
		http://closure-compiler.appspot.com/compile		\
		> build/fireworks.min.js
	@echo size minified + gzip is `gzip -c build/fireworks.min.js | wc -c` byte

buildBundle: buildCore
	echo					 > build/fireworks-bundle.js
	cat build/fireworks.js			>> build/fireworks-bundle.js
	cat examples/plugins/*.js		>> build/fireworks-bundle.js
	cat examples/plugins/shapes/*.js	>> build/fireworks-bundle.js
	cat examples/plugins/spawners/*.js	>> build/fireworks-bundle.js
	cat examples/plugins/renderers/*.js	>> build/fireworks-bundle.js
	cat examples/plugins/helpers/*.js	>> build/fireworks-bundle.js

minifyBundle: buildBundle
	curl --data-urlencode "js_code@build/fireworks-bundle.js" 	\
		-d "output_format=text&output_info=compiled_code&compilation_level=SIMPLE_OPTIMIZATIONS" \
		http://closure-compiler.appspot.com/compile		\
		> build/fireworks-bundle.min.js
	@echo size minified + gzip is `gzip -c build/fireworks-bundle.min.js | wc -c` byte

.PHONY: build minify