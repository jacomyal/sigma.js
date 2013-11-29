CONCAT_PATH=build/sigma.concat.js
MINIFY_PATH=build/sigma.min.js
TEMP_PATH=build/tmp.js
BUILD=build
LICENSE=/* sigmajs.org - an open-source light-weight JavaScript graph drawing library - Version: 0.1 - Author:  Alexis Jacomy - License: MIT */

all: clean concat minify
check:
	gjslint --nojsdoc -r src/ -x "src/sigmaintro.js,src/sigmaoutro.js"
fix:
	fixjsstyle --nojsdoc -r src/
clean:
	rm -f ${MINIFY_PATH} ${CONCAT_PATH}
concat:
	[ -d ${BUILD} ] || mkdir ${BUILD}
	cat ./src/intro.js `find ./src/classes -name "*.js"` ./src/sigmaintro.js `find ./src/core -name "*.js"` `find ./src/public -name "*.js"` ./src/sigmaoutro.js > ${CONCAT_PATH}
install-build-deps:
	npm install
minify: clean concat install-build-deps
	`npm bin`/uglifyjs2 ${CONCAT_PATH} -c > ${MINIFY_PATH}
	echo "${LICENSE}" > ${TEMP_PATH} && cat ${MINIFY_PATH} >> ${TEMP_PATH} && mv ${TEMP_PATH} ${MINIFY_PATH}
