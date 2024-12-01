
function main(examples) {

    // These space settings can be tweaked
    const spaceConfig = {
        width: 800,
        height: 600,
        axis: true,
        axisSize: 10,
        grid: [20, 20],
        perspective: true,
        zoomRange: [1, 1000],
        camera: [20, 10, 20],
        fps: 30,
        verbose: false
    }

    // Locate the DOM element where we will append the examples
    var parent = document.getElementById("pacioli_hook")

    for (const example of examples) {

        const script = example.file
        const fun = example.function

        const paramsWithUoM = example.params.map(([name, val, unit]) => [name, val, unit === 'string' ? undefined : Pacioli.si.parseDimNum(unit || '1').unit]);

        // Call the script function
        const args = paramsWithUoM.map(([, val, unit]) => param2Pacioli(val, unit));
        const sceneOrAnimation = Pacioli.fun(script, fun).apply(args);

        // Create DOM elements
        const headerElement = document.createElement("h2");
        const descriptionElement = document.createElement("p");
        const spaceElement = document.createElement("div");

        // Give the example a title
        headerElement.innerText = "Example " + script + " - " + fun
        headerElement.id = script + "_" + fun

        const unit = Pacioli.si.parseDimNum(example.unit || 'metre').unit

        // Add a Pacioli space and load the scene into it.
        const space = new Pacioli.Space(spaceElement, { ...spaceConfig, ...example.options, unit: unit })
        load(space, sceneOrAnimation, example.kind);

        // Add the example's description
        descriptionElement.innerHTML = space.getDescription();

        // Create a panel with relevant buttons
        const buttonPanel = makeButtonPanel(descriptionElement, space, script, fun, example.kind, paramsWithUoM);

        const subParent = document.createElement("div");
        subParent.style["display"] = "flex"
        subParent.style["gap"] = "10pt"
        subParent.appendChild(spaceElement);
        subParent.appendChild(buttonPanel);

        // Add the elements to the DOM
        parent.appendChild(headerElement);
        parent.appendChild(descriptionElement);
        parent.appendChild(subParent);
    }
}

function makeButtonPanel(descriptionElement, space, script, fun, kind, initialParameters) {

    const SECONDS_PER_ROTATION = 30; // The actual speed is not the 30 that it should be. Issue in space.ts? This speeds it up a little.

    const panel = document.createElement('div');

    let inputButton;
    let stepButton;
    let runButton;

    // Add inputs and a button if the parameter list is not empty
    if (initialParameters.length > 0) {

        inputButton = document.createElement("button");

        // Create input elements for the parameters
        const inputs = initialParameters.map(([label, value, unit]) => {
            const inputElement = document.createElement("input");
            inputElement.value = value
            inputElement.type = unit === undefined ? 'text' : 'number'
            inputElement.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    inputButton.click();
                }
            });
            return [label, inputElement, unit]
        })

        // Add a button to recalculate the scene
        inputButton.innerText = "Enter"
        inputButton.onclick = () => {

            if (!space.isAnimating()) {
                // User clicked the button. Get the input values and update the space

                const params = inputs.map(([, input, unit]) => param2Pacioli(input.value, unit))
                const sceneOrAnimation = Pacioli.fun(script, fun).apply(params);
                load(space, sceneOrAnimation, kind);

                // Update the example's description
                descriptionElement.innerHTML = space.getDescription();

                space.draw()
                if (space.isAnimation() && stepButton) {
                    stepButton.innerText = "Step " + space.animationTime().toFixed(2) + "s"
                }
            }
        }
        // Add the input elements to a table
        const table = document.createElement('table')
        for (const [label, input, unit] of inputs) {
            const row = document.createElement('tr')
            const key = document.createElement('td')
            const value = document.createElement('td')
            const un = document.createElement('td')
            key.innerText = label
            un.innerText = unit ? unit.toText() : ""
            value.appendChild(input)
            row.appendChild(key)
            row.appendChild(value)
            row.appendChild(un)
            table.appendChild(row)
        }

        panel.appendChild(table);
        panel.appendChild(inputButton);
        
    }

    // Add buttons to run the animation
    if (space.isAnimation()) {

        stepButton = document.createElement("button");
        runButton = document.createElement("button");

        stepButton.innerText = "Step " + space.animationTime().toFixed(2) + "s"
        stepButton.onclick = () => {
            if (!space.isAnimating()) {
                space.updateScene();
                space.draw()
                stepButton.innerText = "Step " + space.animationTime().toFixed(2) + "s"
            }
        }

        runButton.innerText = "Start"
        runButton.onclick = () => {
            space.setAnimating(!space.isAnimating());
            runButton.innerText = space.isAnimating() ? "Stop " : "Start";
            stepButton.innerText = "Step " + space.animationTime().toFixed(2) + "s"
            inputButton.disabled = space.isAnimating()
            stepButton.disabled = space.isAnimating()
        }

        panel.appendChild(stepButton);
        panel.appendChild(runButton);
    }

    rotateCheckbox = document.createElement("input");
    rotateCheckbox.type = "checkbox"
    rotateCheckbox.onchange = (event) => {
        if (event.target.checked) {
            space.startAutoRotation(SECONDS_PER_ROTATION)
        } else {
            space.stopAutoRotation()
        }
    }

    panel.appendChild(rotateCheckbox);

    return panel;
}

function param2Pacioli(value, unit) {
    return (unit === undefined) ? Pacioli.string(value) : Pacioli.num(Number(value), unit)
}

function load(space, sceneOrAnimation, kind) {
    switch (kind) {
        case 'scene': {
            space.loadScene(sceneOrAnimation);
            break;
        }
        case 'animation': {
            space.loadAnimation(sceneOrAnimation);
            break;
        }
        case 'stateful-animation': {
            space.loadStatefulAnimation(sceneOrAnimation);
            break;
        }
        default: {
            throw new Error("Unknown kind")
        }
    }
}



