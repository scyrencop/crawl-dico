// Internaute
module.exports.recursiveMap = function (defin, splitter, defmap) {

    if (defin.indexOf("Traduction anglais") > 0) {
        defin = defin.split(splitter)
            .join("|")
            .split("|");
        defmap[splitter] = defin[1].trim();
        this.recursiveMap(defin[0], "Synonyme", defmap);
    } else if (defin.indexOf("Synonyme") > 0 || defin.indexOf("Synonymes") > 0) {
        defin = defin
            .split("Synonymes :")
            .join("|")
            .split("Synonyme :")
            .join("|")
            .split("|");
        defmap["Synonyme"] = defin[1].trim();
        this.recursiveMap(defin[0], "Exemple :", defmap);
    } else if (defin.indexOf("Exemple :") > 0) {
        defin = defin.split("Exemple :").join("|").split("|");
        defmap["Exemple"] = defin[1].trim();
        this.recursiveMap(defin[0], "NONE", defmap);
    } else {
        defmap["Definition"] = defin.trim();
    }
}

// Get Definition
module.exports.getDefinition = function ($, definitions) {

    $(".dico_definition .dico_liste li .grid_last").each(function (i, elem) {
        let definition_map = {};
        let defin = [];
        defin[i] = $(this).text();

        module.exports.recursiveMap(defin[i], "Traduction anglais", definition_map);
        definitions["Sens " + (i + 1)] = {
            'Theme': $(this).prev('.grid_left').children('.dico_exergue_1').text(),
            ...definition_map
        };

    });

}

// Get Synonymes 
module.exports.getSynonymes = function ($, synonymes) {
    $(".dico_synonymes .dico_liste li").each(function (i, elem) {
        synonymes[i] = $(this).text().trim();
    });
}

// Get Citations 
module.exports.getCitations = function ($, citations) {
    $(".dico_citations .dico_liste li").each(function (i, elem) {
        let citation_map = {};
        citation_map.citation = $(this).children().children().first().text().trim(),
        citation_map.author = $(this).children().children().last().text().trim(),
        citations[i] = { ...citation_map };
    });
}