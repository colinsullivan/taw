Quarks.installed.do({
	arg q;

	("Quarks.install(\""++q.name ++ "\", \"" ++ q.refspec ++ "\");").postln();

});