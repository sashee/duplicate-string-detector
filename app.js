var fs = require('fs');
var _ = require('underscore');
var lines = fs.readFileSync(process.argv[2]).toString().split("\n");

// Compute the edit distance between the two given strings
// From: https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
function getEditDistance(a, b) {
    if(a.length === 0) return b.length;
    if(b.length === 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                    Math.min(matrix[i][j-1] + 1, // insertion
                        matrix[i-1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}

var mostSimilars=_.chain(lines)
    .map(function(line,idx,list){
        return _.chain(list)
            .rest(idx+1)
            .map(function(other){return [line,other]})
            .value()
    })
    .flatten(true)
    .map(function(pair){
        return [pair[0],pair[1],getEditDistance(pair[0],pair[1])/Math.max(pair[0].length,pair[1].length)];
    })
    .sortBy(function(qs){
        return qs[2];
    })
    .first(10)
    .value();
console.log(mostSimilars);