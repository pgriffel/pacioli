
function parameterTableHTML(schema) {

    let rows = ''

    for (let param of schema) {
        let unitOptions = '';

        if (param.unitOptions) {
            unitOptions += `<select name="${param.unitField}" onkeydown="onFormKey(event);">`;

            for (let option of param.unitOptions) {
                unitOptions += `<option value="${option}">${Pacioli.unit(option).toText()}</option>`
            }

            unitOptions += '</select>';
        }

        const row =
            `<tr>
                <td class="key"><label for="${param.name}">${param.name}</label></td>
                <td class="value"><input type="number" name="${param.name}"
                        title="${param.description}" value="${param.default}"
                        onkeydown="onFormKey(event);"></td>
                <td class="unit">
                    ${unitOptions}
                </td>
            </tr>`

        rows += row
    }

    return rows
}

function fillFormFromUrl(form, url) {
    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];
        if (element.tagName == "INPUT") {
            var param = getUrlParameter(element.name, url);
            if (param != undefined) {
                var matches = param.match(/([^a-zA-Z_]+)([a-zA-Z_]+)/);
                if (matches) {
                    element.value = matches[1];
                    var unitElement = form.elements[element.name + "_unit"];
                    if (unitElement) {
                        var options = unitElement.options;
                        for (var k = 0; k < options.length; k++) {
                            if (options[k].text == matches[2]) {
                                ;
                                unitElement.value = options[k].value;
                            }
                        }
                    }
                } else {
                    element.value = param;
                }
            }
        } else if (element.tagName == "TEXTAREA") {
            var param = getUrlParameter(element.name, url);
            if (param != undefined) {
                element.value = param;
            }
        }
    }
}

function getUrlParameter(paramName, url) {
    var result;
    var params = url.split("&");
    for (var i = 0; i < params.length; i++) {
        var val = params[i].split("=");
        if (val[0] == paramName) {
            result = unescape(val[1]);
        }
    }
    return result;
}

function readParams(form, schema) {
    var paramsObject = {}

    for (let param of schema) {

        const unit = param.unitField ? Pacioli.unit(form[param.unitField].value) : param.unit
        const num = Pacioli.num(form[param.name].value, unit)

        paramsObject[param.name] = param.unitField ? Pacioli.convertUnit(num, param.unit) : num
    }

    return paramsObject;
}

function currentHRef(form, schema) {
    
    var href = "shells.html";
    var sep = "?";

    for (let param of schema) {
        var value = form.elements[param.name].value;

        href += sep + param.name + "=" + value;

        if (param.unitField) {
            var unitElt = form.elements[param.unitField];
            href += unitElt.options[unitElt.selectedIndex].text;
        }

        sep = "&";
    }

    return href;
}
