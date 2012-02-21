CONCAT_PATH=build/sigma.concat.js
MINIFY_PATH=build/sigma.min.js
CLOSURE=build/compiler.jar

all: clean concat minify-simple
check:
	gjslint --nojsdoc -r src/ -x "src/sigmaintro.js,src/sigmaoutro.js"
fix:
	fixjsstyle --nojsdoc -r src/
clean:
	rm ${MINIFY_PATH} ${CONCAT_PATH}
concat:
	cat ./src/intro.js `find ./src/classes -name "*.js"` ./src/sigmaintro.js `find ./src/core -name "*.js"` `find ./src/public -name "*.js"` ./src/sigmaoutro.js > ${CONCAT_PATH}
minify-simple: clean concat
	java -jar ${CLOSURE} --compilation_level SIMPLE_OPTIMIZATIONS --js ${CONCAT_PATH} --js_output_file ${MINIFY_PATH}
minify-advanced: clean concat
	java -jar ${CLOSURE} --compilation_level ADVANCED_OPTIMIZATIONS --js ${CONCAT_PATH} --js_output_file ${MINIFY_PATH}
