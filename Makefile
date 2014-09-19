BIN := ./node_modules/.bin
TEST_FILES := test/support/env.js $(shell find test/specs -type f -name "*.js")

VERSION := $(shell node -e "console.log(require('./package.json').version)")

.PHONY: cover test lint

test:
	@$(BIN)/mocha --colors $(TEST_FILES)

cover:
	@$(BIN)/istanbul cover $(BIN)/_mocha $(TEST_FILES) -- -R spec

lint:
	@$(BIN)/jshint ./lib

bundle:
	@$(BIN)/browserify lib/spark-browser.js -t cssify | $(BIN)/uglifyjs > dist/spark.min.js

release:
	@$(BIN)/browserify lib/spark-browser.js -t cssify | $(BIN)/uglifyjs > dist/spark.min.js
	@git tag -m "$(VERSION)" v$(VERSION)
	@git push --tags

# When publishing cdnjs, bower,jsdelivr will pick up the new package version
# from either npm registry or github.
# There is no need to run bower register again, this is a one time process,
# command left here just for future reference.
publish:
	#@$(BIN)/bower register spark git@github.com:spark/sparkjs.git
	@npm publish ./
	@$(BIN)/jam publish
