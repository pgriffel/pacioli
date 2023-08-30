/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2022 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * A token found by the tokenizer. The tag indicates the kind of token. The postion
 * is the offset in the input string where it was read. The data array contains the
 * token values, one for each group in the regular expression that was used to match
 * it.
 */
export type Token = {
    tag: string;
    position: number;
    data: string[];
}


/**
 * Tokenizes a string given a list of token specifications. A token specifiation
 * combines a tag and a regular expression string. A RegExp is constructed from
 * the string (no /.../ notation). Groups in the regular expression are returned
 * in the result's data field.
 * 
 * @param expr The string to tokenize
 * @returns A list of token information
 */
export function tokenize(expr: string, spec: {tag: string, regex: string}[]): Token[] {

    // Added whitespace around the token regexes and add and end of file token 
    const tokens = spec
        .map(x => ({ tag: x.tag, regex: new RegExp("\\s*" + x.regex + "\\s*", 'y') }))
        .concat({ tag: 'eof', regex: /\s*$/ })

    // Match tokens until a non-match is encountered or end of file is reached
    let matches = []
    let lastPosition = 0
    let match = matchRegexes(expr, tokens, 0)
    while (match !== undefined && match.tag !== 'eof') {
        matches.push(match)
        lastPosition = match.position
        match = matchRegexes(expr, tokens, match.position)
    }

    // Throw an error if a non-match is encountered
    if (match === undefined) {
        throw new Error('Unknown token at ' + lastPosition)
    }

    // No errors found, return the matches
    return matches
}


/**
 * Helper for tokenize. Tries all regexes on a string at a certain position.
 */
function matchRegexes(input: string, regexes: { tag: string, regex: RegExp }[], position: number): Token | undefined {

    // Loop over the regular expressions
    for (let i = 0; i < regexes.length; i++) {

        // Set the desired position in the string in the last index of the regular 
        // expression to make it match from there 
        const item = regexes[i]
        item.regex.lastIndex = position

        // Match the regular rexpression. Return if successful
        const result = item.regex.exec(input)
        if (result) {
            return {
                tag: item.tag,
                position: item.regex.lastIndex,
                data: result.slice(1)
            }
        }
    }

    // No match was found.
    return undefined
}
