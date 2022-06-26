# groovy-beautify

A simple zero-dependency beautifier which allows formatting and indenting Groovy scripts

# Demo

You can test how it works on the [Demo Website](https://groovy-beautify-web.vercel.app/)

# Installation

    npm install groovy-beautify

# Usage

    import groovyBeautify from "groovy-beautify";

    const groovy = `
        def bumpVersion(String target,    String version_type, Boolean reset =   false) {    def
	    versionMap =
        ['major':0, 'minor' : 1, 'patch':   2]
                    def versionArray = target.findAll(/\d+\.\d+\.\d+/)[0].tokenize('.')
                try
        {        def   index =     versionMap.get(version_type);
        versionArray[index] =versionArray[index].toInteger() + 1
        if(   reset )
        {
            for(int i=2;i>index;     i--) {
                versionArray[i]    =    0            }        }
        } catch(       Exception e) {        println("Unrecognized version type \\"version_type\\" (should be major, minor or patch)")    }
        return             versionArray.join(                   '.'                       )
        }
        println(bumpVersion('1.2.3', 'minor', true))
    `;

    const formatted = groovyBeautify(groovy);

This will produce the following output

    def bumpVersion(String target, String version_type, Boolean reset = false) {
        def versionMap = ['major': 0, 'minor': 1, 'patch': 2]
        def versionArray = target.findAll(/d+.d+.d+/)[0].tokenize('.')
        try {
            def index = versionMap.get(version_type);
            versionArray[index] = versionArray[index].toInteger() + 1
            if (reset)
            {
                for (int i = 2; i > index; i--) {
                    versionArray[i] = 0
                }
            }
        } catch (Exception e) {
            println("Unrecognized version type \"version_type\" (should be major, minor or patch)")
        }
        return versionArray.join('.')
    }

    println(bumpVersion('1.2.3', 'minor', true))

# License

You are free to use this in any way you want, in case you find this useful or working for you but you must keep the copyright notice and license. (MIT)

# Credits

* Created by Sergei Kasoverskij, <joycollector@gmail.com>