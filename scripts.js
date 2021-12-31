var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

var Grenier = {
  probasInspection: [20, 8, 5,  3, 0, 2, 1, 1, 0, 0],
  probasCarton:     [12, 6, 8,  9, 1, 0, 1, 0, 1, 0],
  probasCoffre:     [ 2, 9, 5, 12, 0, 0, 2, 0, 0, 1],
  Dictionnaire: [
    {nom:"un déchet", type:"dechets", valeur: 0},
    {nom:"un bibelot", type:"bibelots", valeur: 1},
    {nom:"une godasse", type:"godasses", valeur: 1},
    {nom:"un livre", type:"livres", valeur: 1},
    {nom:"une clef", type:"clefs", valeur: 1},
    {nom:"un carton", type:"cartons", valeur: 1},
    {nom:"un bijou", type:"bijoux", valeur: 1},
    {nom:"un coffre", type:"coffres", valeur: 1},
    {nom:"une lampe", type:"lampes", valeur: 1},
    {nom:"une loupe", type:"loupes", valeur: 1}
  ],
  Tresor: 0,
  Ordre: 20,
  addToTresor: function(montant) {
    Grenier.Tresor += montant;
    document.getElementById("tresor").innerHTML = Grenier.Tresor;
    var completion = ((Grenier.Tresor / 100) > 100) ? 100: (Grenier.Tresor / 100);
    document.getElementById("finances").style = "width:" + completion + "%";
    document.getElementById("finances").innerHTML = completion + " %";
  },
  modifierOrdre: function(val) {
    Grenier.Ordre += val;
    document.getElementById("ordre").style = "width:" + Grenier.Ordre + "%";
    document.getElementById("ordre").innerHTML = Grenier.Ordre + " %";
  },
  Inventaire: {
    Actions: {
      bibelots: {
        id: "estimer-bibelots",
        texte: "Estimer <span class=\"badge bg-secondary\">1</span> bibelot",
        effet: window.clickEstimerBibelot,
        seuil: 1
      },
      godasses: {
        id: "reparer-godasses",
        texte: "Réparer <span class=\"badge bg-secondary\">2</span> godasses",
        effet: window.clickReparerGodasses,
        seuil: 2
      },
      paires: {
        id: "vendre-paires",
        texte: "Vendre <span class=\"badge bg-secondary\">1</span> paire de chaussures",
        effet: window.clickVendrePaires,
        seuil: 1
      },
      bijoux: {
        id: "vendre-bijoux",
        texte: "Vendre <span class=\"badge bg-secondary\">1</span> bijou",
        effet: window.clickVendreBijou,
        seuil: 1
      },
      cartons: {
        id: "ouvrir-cartons",
        texte: "Ouvrir <span class=\"badge bg-secondary\">1</span> carton",
        effet: window.clickOuvrirCarton,
        seuil: 1
      },
      coffres: {
        id: "ouvrir-coffres",
        texte: "Ouvrir <span class=\"badge bg-secondary\">1</span> coffre",
        effet: window.clickOuvrirCoffre,
        seuil: 1
      },
      livres: {
        id: "regrouper-livres",
        texte: "Regrouper <span class=\"badge bg-secondary\">5</span> livres en 1 <mark>rayon</mark>",
        effet: window.clickRegrouperLivres,
        seuil: 5
      },
      rayons: {
        id: "regrouper-rayons",
        texte: "Regrouper <span class=\"badge bg-secondary\">5</span> rayons en 1 <mark>bibliothèque</mark>",
        effet: window.clickRegrouperRayons,
        seuil: 5
      },
      bibliotheques: {
        id: "vendre-bibliotheques",
        texte: "Vendre <span class=\"badge bg-secondary\">1</span> bibliothèque",
        effet: window.clickVendreBibliotheque,
        seuil: 1
      },
      clefs: {
        id: "regrouper-clefs",
        texte: "Regrouper <span class=\"badge bg-secondary\">3</span> clefs pour former 1 <mark>trousseau de clefs</mark>",
        effet: window.clickRegrouperClefs,
        seuil: 3
      },
      lampes: {
        id: "vendre-lampes",
        texte: "Vendre <span class=\"badge bg-secondary\">1</span> lampe torche",
        effet: window.clickVendreLampe,
        seuil: 1
      },
      loupes: {
        id: "vendre-loupes",
        texte: "Vendre <span class=\"badge bg-secondary\">1</span> loupe",
        effet: window.clickVendreLoupe,
        seuil: 1
      },
      dechets: {
        id: "recycler-dechets",
        texte: "Recycler <span class=\"badge bg-secondary\">10</span> déchets",
        effet: window.clickRecyclerDechets,
        seuil: 10
      }
    },
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
        if (!!Grenier.Inventaire.Actions[obj]) {
          var action = Grenier.Inventaire.Actions[obj];
          var bouton = document.createElement("BUTTON");
          bouton.setAttribute("disabled", "disabled");
          bouton.setAttribute("id", action.id);
          bouton.setAttribute("class", "btn btn-primary");
          bouton.innerHTML = action.texte;
          bouton.addEventListener("click", action.effet, false);
          tdActions.appendChild(bouton);
        }
        newLigne.appendChild(tdObjet);
        newLigne.appendChild(tdQuantite);
        newLigne.appendChild(tdActions);
        inventaireElem.appendChild(newLigne);
      }
      var seuil = Grenier.Inventaire.Actions[obj] ? Grenier.Inventaire.Actions[obj].seuil: 1;
      if (Grenier.Inventaire.collection[obj] + q >= seuil) {
        var actions = document.getElementById("actions-" + obj);
        if (actions.childElementCount > 0) {
          for (var node in actions.childNodes) {
            actions.childNodes.item(node).removeAttribute("disabled");
          }
        }
      }

      Grenier.Inventaire.collection[obj] += q;

      if (Grenier.Inventaire.collection[obj] < seuil) {
        var actions = document.getElementById("actions-" + obj);
        for (var node in actions.childNodes) {
          if (actions.childNodes.item(node)) {
            actions.childNodes.item(node).setAttribute("disabled", "disabled");
          }
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
  trouver: function(probas) {
    return probaSwitch(Grenier.Dictionnaire, probas);
  },
  messagesUniques: {}
}

function clickChercher(e) {
  if (Grenier.messagesUniques['recherche1']) {
    var seuil = (!Grenier.Inventaire.collection["lampes"]) ? 80: 72;
    seuil += (10 -(Grenier.Ordre / 10));
    var tirage = de(100);
    if (tirage > seuil) {
      Grenier.Inventaire.modifierStock("trucs", 1);
      var message = "Vous avez trouvé 1 truc.";
      if (tirage < (81 + (10 -(Grenier.Ordre / 10)))) {
        message += " (grâce à la lampe)";
      }
      Grenier.afficher({strong: "Bien vu !", msg: message, type: "success"});
    }
    if ((tirage == 1) && (Grenier.Inventaire.collection["lampes"]) && de(6) > 5) {
      Grenier.Inventaire.modifierStock("lampes", -1);
      Grenier.afficher({strong: "Malheur !", msg: "Vous avez cassé votre <mark>lampe</mark> en cherchant dans le grenier...", type: "danger"});
    }
  }
  else {
    Grenier.messagesUniques['recherche1'] = true;
    Grenier.afficher({strong: "Courage...", msg: "il faut persévérer pour trouver des trucs.", type: "info"});
  }
  if ((Grenier.Ordre > 0) && (de(2) > 1)) {
    Grenier.modifierOrdre(-1);
  }
}

function clickRanger(e) {
  if (Grenier.Ordre == 100 || de(3) > 1) {
    return;
  }
  var valeur = Grenier.Ordre + de(5);
  if (valeur > 100) {
    valeur = 100;
  }
  Grenier.modifierOrdre(valeur - Grenier.Ordre);
}

function clickInspecterTrucs(e) {
  var seuil = (!Grenier.Inventaire.collection["loupes"]) ? 80: 73;
  var tirage = de(100);
  if (tirage > 99) {// 100
    var parties = de(2) + de(2);
    Grenier.Inventaire.modifierStock("trucs", parties-1);
    Grenier.afficher({strong: "Quelle chance !", msg: "En l'inspectant, vous remarquez que ce truc se décompose en réalité en " + parties + " plus petits trucs.", type: "success"});
  }
  else if (tirage > seuil) {// 81-99 (ou 74-99 si loupe)
    Grenier.Inventaire.modifierStock("trucs", -1);
    var trouvaille = Grenier.trouver(Grenier.probasInspection);
    if (trouvaille.valeur > 0) {
      var message = "Votre inspection est un succès. Ce truc était en fait<mark>" + trouvaille.nom + "</mark>";
      if (tirage < 81) {
        message += "<br>(inspection réussie grâce à la loupe)";
      }
      Grenier.afficher({strong: "Bravo !", msg: message, type: "success"});
    }
    else {
      Grenier.afficher({strong: "Misère...", msg: "Votre inspection est un succès, mais ce truc n'était en fait qu'<mark>" + trouvaille.nom + "</mark>", type: "secondary"});
    }
    Grenier.Inventaire.modifierStock(trouvaille.type, 1);
  }
  else if (tirage > 8) {// 9-79
    if (!Grenier.messagesUniques['inspection1']) {
      Grenier.messagesUniques['inspection1'] = true;
      Grenier.afficher({strong: "Inspection infructueuse :", msg: "Vous ne parvenez pas encore à déterminer la nature du truc, réessayez. (Ce message ne sera plus affiché)", type: "info"});
    }
  }
  else {// 1-8
    if (!!Grenier.Inventaire.collection["loupes"] && de(16) > 15) {
      Grenier.Inventaire.modifierStock("loupes", -1);
      Grenier.afficher({strong: "Malheur !", msg: "Vous avez cassé votre <mark>loupe</mark> en inspectant ce truc...", type: "danger"});
    }
    else {
      Grenier.Inventaire.modifierStock("trucs", -1);
      Grenier.afficher({strong: "Echec !", msg: "Vous avez cassé le truc en l'inspectant...", type: "warning"});
    }
  }
}

function clickEstimerBibelot(e) {
  var tirage = de(100);
  if (tirage > 98) {// 99-100
    Grenier.afficher({strong: "Une rareté !", msg: "Ce bibelot s'avère être un superbe <mark>bijou</mark>. Probablement d'une grande valeur...", type: "success"});
    Grenier.Inventaire.modifierStock("bibelots", -1);
    Grenier.Inventaire.modifierStock("bijoux", 1);
  }
  else if (tirage > 75) {// 76-98
    Grenier.afficher({strong: "Etat correct.", msg: "Ce bibelot est à peu près présentable, vous en tirez 5 €.", type: "info"});
    Grenier.addToTresor(5);
    Grenier.Inventaire.modifierStock("bibelots", -1);
  }
  else {// 1-75
    Grenier.afficher({strong: "Piteux état.", msg: "Ce bibelot ne valait rien, autant le jeter aux déchets.", type: "secondary"});
    Grenier.Inventaire.modifierStock("dechets", 1);
    Grenier.Inventaire.modifierStock("bibelots", -1);
  }
}

function clickVendreBijou(e) {
  var valeur = 15 + (de(50) * 5);
  Grenier.afficher({strong: "Bijou vendu.", msg: "Le bijou avait une valeur de " + valeur + " €.", type: "info"});
  Grenier.addToTresor(valeur);
  Grenier.Inventaire.modifierStock("bijoux", -1);
}

function clickRecyclerDechets(e) {
  Grenier.afficher({strong: "Recyclage effectué.", msg: "L'ensemble du lot vous rapporte 5 €.", type: "info"});
  Grenier.addToTresor(5);
  Grenier.Inventaire.modifierStock("dechets", -10);
}

function clickReparerGodasses(e) {
  if (Grenier.Tresor < 5) {
    Grenier.afficher({strong: "Manque de fonds...", msg: "Le coût de réparation de ces godasses est de 5 €. Augmentez d'abord votre trésor.", type: "warning"});
    return;
  }
  var tirage = de(100);
  if (tirage > 30) {
    Grenier.afficher({strong: "Réparation réussie !", msg: "Vous avez pu remettre en état une <mark>paire de chaussures</mark>.<br>(Coût de réparation : 5 €)", type: "success"});
    Grenier.Inventaire.modifierStock("paires", 1);
  }
  else {
    Grenier.afficher({strong: "Réparation ratée.", msg: "Ces godasses étaient en trop mauvais état, autant les considérer comme des <mark>déchets</mark>.<br>(Coût de réparation : 5 €)", type: "secondary"});
    Grenier.Inventaire.modifierStock("dechets", 2);
  }
  Grenier.addToTresor(-5);
  Grenier.Inventaire.modifierStock("godasses", -2);
}

function clickVendrePaires(e) {
  var valeur = (de(6) * 10) - 1;
  Grenier.afficher({strong: "Paire vendue.", msg: "Ces chaussures valaient " + valeur + " €.", type: "info"});
  Grenier.addToTresor(valeur);
  Grenier.Inventaire.modifierStock("paires", -1);
}

function clickRegrouperClefs(e) {
  Grenier.Inventaire.modifierStock("clefs", -3);
  Grenier.Inventaire.modifierStock("trousseaux", 1);
  Grenier.afficher({strong: "Trousseau de clefs formé.", msg: "Ces 3 clefs forment désormais un <mark>trousseau de clefs</mark>.<br>Il vous permet d'ouvrir les coffres sans dépenser de clef.", type: "success"});
}

function clickOuvrirCarton(e) {
  Grenier.Inventaire.modifierStock("cartons", -1);
  var combien = de(6) + 1;
  var message = "A l'intérieur du carton, " + combien + " objets :";
  var trouvailles = {};
  for (var i = 0, trouvaille = {}; i < combien; ++i) {
    trouvaille = Grenier.trouver(Grenier.probasCarton);
    trouvailles[trouvaille.nom] = trouvailles[trouvaille.nom] ? trouvailles[trouvaille.nom] + 1: 1;
    Grenier.Inventaire.modifierStock(trouvaille.type, 1);
  }
  for (var t in trouvailles) {
    message += "<br>" + t;
    if (trouvailles[t] > 1) {
      message += " x " + trouvailles[t];
    }
  }
  Grenier.afficher({strong: "Carton ouvert.", msg: message, type: "success"});
}

function clickOuvrirCoffre(e) {
  if (!Grenier.Inventaire.collection["clefs"] && !Grenier.Inventaire.collection["trousseaux"]) {
    Grenier.afficher({strong: "Coffre verouillé.", msg: "Pour l'ouvrir, il vous faudrait une <mark>clef</mark>...", type: "warning"});
    return;
  }
  Grenier.Inventaire.modifierStock("coffres", -1);
  if (!Grenier.Inventaire.collection["trousseaux"]) {
    Grenier.Inventaire.modifierStock("clefs", -1);
  }
  var combien = de(5) + 5;
  var message = "A l'intérieur du coffre, " + combien + " objets :";
  var trouvailles = {};
  for (var i = 0, trouvaille = {}; i < combien; ++i) {
    trouvaille = Grenier.trouver(Grenier.probasCoffre);
    trouvailles[trouvaille.nom] = trouvailles[trouvaille.nom] ? trouvailles[trouvaille.nom] + 1: 1;
    Grenier.Inventaire.modifierStock(trouvaille.type, 1);
  }
  for (var t in trouvailles) {
    message += "<br>" + t;
    if (trouvailles[t] > 1) {
      message += " x " + trouvailles[t];
    }
  }
  Grenier.afficher({strong: "Coffre ouvert.", msg: message, type: "success"});
}

function clickRegrouperLivres(e) {
  Grenier.Inventaire.modifierStock("livres", -5);
  Grenier.Inventaire.modifierStock("rayons", 1);
  Grenier.afficher({strong: "Rayon formé.", msg: "Ces 5 livres forment désormais un <mark>rayon de bibliothèque</mark>.", type: "success"});
}

function clickRegrouperRayons(e) {
  Grenier.Inventaire.modifierStock("rayons", -5);
  Grenier.Inventaire.modifierStock("bibliotheques", 1);
  Grenier.afficher({strong: "Bibliothèque formée !", msg: "Ces 5 rayons forment désormais une <mark>bibliothèque</mark> !", type: "success"});
}

function clickVendreBibliotheque(e) {
  var valeur = (de(4) + 2) * 100;
  Grenier.afficher({strong: "Bibliothèque vendue.", msg: "La vente de la bibliothèque a rapporté " + valeur + " €.", type: "info"});
  Grenier.addToTresor(valeur);
  Grenier.Inventaire.modifierStock("bibliotheques", -1);
}

function clickVendreLampe(e) {
  if (!Grenier.messagesUniques["venteLampe"]) {
    Grenier.messagesUniques["venteLampe"] = true;
    Grenier.afficher({strong: "Attention !", msg: "Sachez que si vous possédez au moins 1 <mark>lampe</mark>, vos chances de trouver des <mark>trucs</mark> sont plus élevées...<br>(bonus : +40%)", type: "warning"});
    return;
  }
  var valeur = (de(3) * 10) - 1;
  Grenier.afficher({strong: "Lampe vendue.", msg: "Cette lampe valait " + valeur + " €.", type: "info"});
  Grenier.addToTresor(valeur);
  Grenier.Inventaire.modifierStock("lampes", -1);
}

function clickVendreLoupe(e) {
  if (!Grenier.messagesUniques["venteLoupe"]) {
    Grenier.messagesUniques["venteLoupe"] = true;
    Grenier.afficher({strong: "Attention !", msg: "Sachez que si vous possédez au moins 1 <mark>loupe</mark>, vos chances de réussir l'inspection des <mark>trucs</mark> sont plus élevées...<br>(bonus : +40%)", type: "warning"});
    return;
  }
  var valeur = (de(4) * 10) - 1;
  Grenier.afficher({strong: "Loupe vendue.", msg: "Cette loupe valait " + valeur + " €.", type: "info"});
  Grenier.addToTresor(valeur);
  Grenier.Inventaire.modifierStock("loupes", -1);
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

var boutonChercher = document.getElementById("ranger");
boutonChercher.addEventListener("click", clickRanger, false);

var boutonInspecterTrucs = document.getElementById("inspecter-trucs");
boutonInspecterTrucs.addEventListener("click", clickInspecterTrucs, false);