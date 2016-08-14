import {
    argv
} from 'yargs';

import {
    templateAsync,
    writeFileAsync
} from './fsAsync';

const scafold = async() => {
    if (argv.t === "component") {
        if (!argv.n) {
            console.log("please specify component name you want to scafold with -n option");
            return;
        }
        const templated = await templateAsync("./build/templates/component.template", {
            name: argv.n
        });
        await writeFileAsync("./src/Components/" + argv.n + "Component.ts", templated);
    } else if (argv.t === "converter") {
        if (!argv.n) {
            console.log("please specify converter name you want to scafold with -n option");
            return;
        }
        const templated = await templateAsync("./build/templates/converter.template", {
            name: argv.n
        });
        await writeFileAsync("./src/Converters/" + argv.n + "Converter.ts", templated);
    } else {
        console.log("Please specify valid type to scafold with -t option. 'component' or 'converter' are available.")
    }

}

scafold();