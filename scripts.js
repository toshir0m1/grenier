var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

var Grenier = {
  probasDictionnaire: [20, 5, 4, 2, 1],
  Dictionnaire: [
    {nom:"un déchet", type:"dechets", valeur: 0},
    {nom:"un bibelot", type:"bibelots", valeur: 1},
    {nom:"une godasse", type:"godasses", valeur: 1},
    {nom:"un livre", type:"livres", valeur: 5},
    {nom:"une clef", type:"clefs", valeur: 8}
  ],
  Inventaire: {
    collection: {
      trucs: 0,
    },

    modifierStock: function(obj, q) {
      if (Grenier.Inventaire.collection[obj] === undefined) {
        Grenier.Inventaire.collection[obj] = 0;
        var inventaireElem = document.getElementById("inventaire");
        var newLigne = document.createElement("TR");
        var tdObjet = document.createElement("TD");
        tdObjet.innerHTML = obj[0].toUpperCase() + obj.substring(1);
        var tdQuantite = document.createElement("TD");
        tdQuantite.id = "inventaire-" + obj;
        tdQuantite.innerHTML = 0;
        var tdActions = document.createElement("TD");
        tdActions.id = "actions-" + obj;
        newLigne.appendChild(tdObjet);
        newLigne.appendChild(tdQuantite);
        newLigne.appendChild(tdActions);
        inventaireElem.appendChild(newLigne);
      }
      if ((Grenier.Inventaire.collection[obj] == 0) && (q > 0)) {
        var actions = document.getElementById("actions-" + obj);
        if (actions.childElementCount > 0) {
          for (var node in actions.childNodes) {
            actions.childNodes.item(node).removeAttribute("disabled");
          }
        }
      }
      Grenier.Inventaire.collection[obj] += q;
      if (Grenier.Inventaire.collection[obj] == 0) {
        var actions = document.getElementById("actions-" + obj);
        for (var node in actions.childNodes) {
          actions.childNodes.item(node).setAttribute("disabled", "disabled");
        }
      }
      Grenier.Inventaire.maj();
    },
    maj: function() {
      for (var obj in Grenier.Inventaire.collection) {
        var ligneCible = document.getElementById("inventaire-" + obj);
        ligneCible.innerHTML = Grenier.Inventaire.collection[obj];
      }
    }
  },
  afficher: function(logBlock) {
    var journal = document.getElementById("logBox");
    var elem = document.createElement("div");
    var newClass = "alert alert-" + logBlock.type;
    elem.setAttribute("class", newClass);
    elem.innerHTML = "<strong>" + logBlock.strong + "</strong> " + logBlock.msg;
    journal.insertBefore(elem, journal.firstChild);
    if (journal.childElementCount > 6) {
      journal.removeChild(journal.lastElementChild);
    }
  },
  trouver: function() {
    return probaSwitch(Grenier.Dictionnaire, Grenier.probasDictionnaire);
  },
  messagesUniques: {}
}

function clickChercher() {
  if (Grenier.messagesUniques['recherche1']) {
    if (de(10) > 9) {
      Grenier.Inventaire.modifierStock("trucs", 1);
      Grenier.afficher({strong: "Bien vu !", msg: "Vous avez trouvé 1 truc.", type: "success"});
    }
  }
  else {
    Grenier.messagesUniques['recherche1'] = true;
    Grenier.afficher({strong: "Courage...", msg: "il faut persévérer pour trouver des trucs.", type: "info"});
  }
}

function clickInspecterTrucs() {
  var tirage = de(100);
  if (tirage > 99) {// 100
    var parties = de(2) + de(2);
    Grenier.Inventaire.modifierStock("trucs", parties);
    Grenier.afficher({strong: "Quelle chance !", msg: "En l'inspectant, vous remarquez que ce truc se décompose en réalité en " + parties + " petits trucs.", type: "success"});
  }
  else if (tirage > 90) {// 91-99
    Grenier.Inventaire.modifierStock("trucs", -1);
    var trouvaille = Grenier.trouver();
    if (trouvaille.valeur > 0) {
      Grenier.afficher({strong: "Bravo !", msg: "Votre inspection est un succès. Ce truc était en fait<mark>" + trouvaille.nom + "</mark>", type: "success"});
    }
    else {
      Grenier.afficher({strong: "Misère...", msg: "Votre inspection est un succès, mais ce truc n'était en fait qu'<mark>" + trouvaille.nom + "</mark>", type: "secondary"});
    }
    Grenier.Inventaire.modifierStock(trouvaille.type, 1);
  }
  else if (tirage > 3) {// 4-89
    if (!Grenier.messagesUniques['inspection1']) {
      Grenier.messagesUniques['inspection1'] = true;
      Grenier.afficher({strong: "Inspection infructueuse :", msg: "Vous ne parvenez pas encore à déterminer la nature du truc, réessayez. (Ce message ne sera plus affiché)", type: "info"});
    }
  }
  else {// 1-3
    Grenier.Inventaire.modifierStock("trucs", -1);
    Grenier.afficher({strong: "Echec !", msg: "Vous avez cassé le truc en l'inspectant...", type: "warning"});
  }
}

function de(max) {
  if (max < 1) { return 0; }
  return Math.round((Math.random() * max) + .5);
}

function probaSwitch(tabValeurs, tabPoids) {
  if (tabValeurs.length != tabPoids.length) {
    alert("arguments de la fonction probaSwitch() mal formés :\ntabValeurs.length = " + tabValeurs.length + "\ntabPoids.length = " + tabPoids.length);
    return null;
  }
  
  var somme = tabPoids.additionner();
  var echelle = 100 / somme;   
  for (var i = 0, iMax = tabValeurs.length; i < iMax; ++i) {
    tabPoids[i] *= echelle;
  }
  
  var seuil, tirage = Math.random() * 100;
  for (var i = 0, iMax = tabValeurs.length; i < iMax; ++i) {
    seuil = 0;
    for (var j = 0; j <= i; ++j) {
      seuil += tabPoids[j];
    }
    if (tirage <= seuil) {
      return tabValeurs[i];
    }
    if (i == (iMax - 1)) {
      return tabValeurs[i];
    }
  }
  return null;
}

Array.prototype.additionner = function() {
  var somme = 0;
  for (var i = 0, iMax = this.length; i < iMax; ++i) {
    if (type(this[i]).indexOf("number") > -1) {
      somme += this[i];
    }
  }
  return somme;
}

// FONCTION : détermine le type de l'objet passé en paramètre
// PARAM #1 : "objet" (object) : objet à examiner
// RETOUR : chaine décrivant le type :
// ("string", "number(int)", "number(float)", "date", "array", "function", "element", "node", "object", "undefined") 
function type(objet) {
  if (typeof objet == "string")
    return "string";
  if (typeof objet == "number")
    return (Math.round(objet) != objet) ? "number(float)" : "number(int)";
  if ((objet != null) && ("getUTCFullYear" in objet))
    return "date";
  if (typeof objet == "function")
    return "function";
  if ((objet != null) && ("splice" in objet) && ("join" in objet))
    return "array";
  if ((objet != null) && objet.nodeType)
    return (objet.nodeType == Node.ELEMENT_NODE) ? "element" : "node";
  if ((objet != null) && (typeof objet == "object"))
    return "object";
  
  return "undefined";
}

var boutonChercher = document.getElementById("chercher");
boutonChercher.addEventListener("click", clickChercher, false);

var boutonInspecterTrucs = document.getElementById("inspecter-trucs");
boutonInspecterTrucs.addEventListener("click", clickInspecterTrucs, false);
