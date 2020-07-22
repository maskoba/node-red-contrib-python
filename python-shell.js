module.exports = function(RED) {
    function PythonShellNode(config) {
        RED.nodes.createNode(this,config);
        this.name = config.name;
        this.python = config.python;
        this.pypath = config.pypath;
        this.pyshellpath = config.pyshellpath;

        var node = this;
        node.on("input", function(msg) {
            try {
                var {PythonShell} = require(node.pyshellpath); 
                let options = {
                    pythonPath: node.pypath, 
                    pythonOptions: ['-u']
                  };

                PythonShell.runString(node.python, options, function (err, result) {
                    if (err) {
                        msg.payload = err;
                    } else {
                        if (result.length > 0) {
                            msg.payload = result[0];
                        } else {
                            msg.payload = "";
                        }
                    }
                    node.send(msg);
                });
            } catch(err) {
                node.error(err.message);
            }
        });
    }
    RED.nodes.registerType("python-shell",PythonShellNode);
}