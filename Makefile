NAME=		pastebin-raw-text

FILES=		background.js manifest.json
FILES+=		icon128.png icon16.png icon32.png icon48.png

all: ${NAME}.zip

${NAME}.zip: ${FILES}
	@${MAKE} clean
	mkdir -p ${NAME}
	cp ${FILES} ${NAME}
	zip -r ${NAME}.zip ${NAME}

clean:
	rm -rf ${NAME} ${NAME}.zip
