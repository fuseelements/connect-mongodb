MOCHA = node_modules/mocha/bin/mocha

test:
	@$(MOCHA) --ignore-leaks tests/core.js

.PHONY: test
