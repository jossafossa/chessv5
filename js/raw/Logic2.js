// master
class Rule {

}



// base class for rule
// 
// Ruletypes have their own logic.
// 



class RuleFlags {
	RuleFlag() {
		this.flags = {};
	}

	add(char, slug) {
		this.flags[char] = slug;
	}

	includes(char) {
		if (this.flags.includes(char)) {
			return true;
		}
		return false;
	}
}

class RuleType {
	RuleType(rule) {
		this.rule = rule;
		this.flags =  new RuleFlags();
	}

	get() {
		return {};
	}

	loop() {
		for (var i = 0; i++ < this.rule.length;) {
			var char = this.rule.charAt(i);
			if (this.flags.includes(char)) {
				this.flags.enable(char);
			}
		}
	}
}

// specialized classes for each ruleTypes
class MoveRule extends RuleType {
	MoveRule(rule) {
		super();

		this.flags = new RuleFlag();
		this.flags.add({m: "move"});

		this.loop();
	}

}

class TransformRule extends RuleType {

}

class WinRule extends RuleType {

}

class RokadeRule extends RuleType {

}