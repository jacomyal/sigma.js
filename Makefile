CONCAT_PATH=build/sigma.concat.js
MINIFY_PATH=build/sigma.min.js
TEMP_PATH=build/tmp.js
CLOSURE=build/compiler.jar
BUILD=build
LICENSE=/* sigmajs.org - an open-source light-weight JavaScript graph drawing library - Version: 0.1 - Author:  Alexis Jacomy - License: MIT */

all: clean concat minify-simple
check:
	gjslint --nojsdoc -r src/ -x "src/sigmaintro.js,src/sigmaoutro.js"
fix:
	fixjsstyle --nojsdoc -r src/
clean:
	rm -f ${MINIFY_PATH} ${CONCAT_PATH}
concat:
	[ -d ${BUILD} ] || mkdir ${BUILD}
	cat ./src/intro.js `find ./src/classes -name "*.js"` ./src/sigmaintro.js `find ./src/core -name "*.js"` `find ./src/public -name "*.js"` ./src/sigmaoutro.js > ${CONCAT_PATH}
minify-simple: clean concat
	java -jar ${CLOSURE} --compilation_level SIMPLE_OPTIMIZATIONS --js ${CONCAT_PATH} --js_output_file ${MINIFY_PATH}
	echo "${LICENSE}" > ${TEMP_PATH} && cat ${MINIFY_PATH} >> ${TEMP_PATH} && mv ${TEMP_PATH} ${MINIFY_PATH}
minify-advanced: clean concat
	java -jar ${CLOSURE} --compilation_level ADVANCED_OPTIMIZATIONS --js ${CONCAT_PATH} --js_output_file ${MINIFY_PATH}
	echo "${LICENSE}" > ${TEMP_PATH} && cat ${MINIFY_PATH} >> ${TEMP_PATH} && mv ${TEMP_PATH} ${MINIFY_PATH}
