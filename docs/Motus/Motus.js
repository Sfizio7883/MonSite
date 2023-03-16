const Mot = 'bonjour';
var occurencesParLettre = new Map();
var LettreVide = ".";
var GrilleMotus = [];
var tabColor =[];
var NbrCoups;
var NbrLignes = 7;
var NbrColonnes = 7;
var finJeu = false;
var MotEnCours = [];

var PropositionMot = document.querySelector("#PropositionMot");

InitialiserJeu();

function InitialiserJeu(){
    finJeu = false;
    NbrCoups = 0;
    
    // Enregistrements des lettres présentes dans le mots et de leur nombre de fois
    occurencesParLettre = SauvegardeLettreMot(Mot.toUpperCase());

    // Initialisation de la première ligne du jeu avec la première lettre et des points
    this.GrilleMotus = InitialisationGrilleMotus(NbrLignes, NbrColonnes, Mot[0]);

    // Premier affichage du jeu
    afficherGrilleMotus(NbrCoups);
}

function SauvegardeLettreMot(Mot){
    var occurencesParLettreLocal = new Map();
    
    for (let character of Mot){
        if (!occurencesParLettreLocal.has(character)){
            occurencesParLettreLocal.set(character, 1);
        }
        else{
            var nbOccurence = occurencesParLettreLocal.get(character);
            nbOccurence++;
            occurencesParLettreLocal.set(character, nbOccurence);
        } 
    }
    return occurencesParLettreLocal;
}

function InitialisationGrilleMotus(NbrLignes, NbrColonnes, PreLettre){
    var tab = [];
    var ligne = [];
    var ligneColor = [];

    // Init de la première lettre avec la couleur Vert
    ligne.push(PreLettre);
    ligneColor.push('0');

    // Boucle sur les 6 lettres suivantes pour les initialiser avec . et la couleur blanc
    for(var j=1;j < NbrColonnes; j++){
        ligne.push(LettreVide);
        ligneColor.push('0');
    }
    // Ecriture de la première ligne et des couleurs des caractères
    tab.splice(0, 0, ligne);
    this.tabColor.push(ligneColor);
    
    return tab;
}
function afficherGrilleMotus(NbrCoups){
    const jeu = document.querySelector("#jeu");
    jeu.innerHTML = "";
    var Color;
    
    var content = "<table class='border border-white'>";
        for(var i=0; i <= NbrCoups;i++){
            content += "<tr>";
            for(var j=0 ; j < this.NbrColonnes;j++){
                switch(this.tabColor[i][j]){
                    case '0': 
                        Color = " bg-white";
                        break;
                    case '1': 
                        Color = " bg-warning";
                        break;
                    case '2': 
                        Color = " bg-success";
                        break;
                    case '3': 
                        Color = " bg-danger";
                        break;
                }
                content += "<td class=' border" + Color + "' width='50' height='50'>";
                content += '<p class="text-center text-uppercase font-weight-bold" style="margin-top:10px;font-size: 20px">' + this.GrilleMotus[i][j] + '</p>'
                content += "</td>";
            }
            content += "</tr>";
        }
    content += "</table>";
    jeu.innerHTML = content;
}

function VérificationEntree(event){
    if (event.key == "Enter") {
        if (PropositionMot.value.length === 7){
            Jouer();
        }
    }
}
function Jouer(){
    // Si le jeu n'est pas terminé
    if(!finJeu){

        // Alimentation de la ligne en cours avec le mot prosposé
        AlimentationGrilleMotus(this.NbrCoups);

        // Si le jeu n'est pas terminé
        if(!finJeu){
            NbrCoups++;
            // Si le nombre de coup est à 7, le jeu est terminé
            if (NbrCoups === 7){
                // Alimentation de la dernière ligne avec le mot à deviner en Rouge
                AlimentationGrilleMotusLast();
                finJeu = true;
            }
            else{
                // Alimentation la ligne pour le prochain coup avec les lettres déjà devinées
                AlimentationGrilleMotusNext(this.NbrCoups);
            }
        }

        // Affichage du jeu
        afficherGrilleMotus(NbrCoups);

        // Reset du  texte dans le Input
        PropositionMot.value = "";
    }
}

function AlimentationGrilleMotus(NbrCoups){
    var ligne = [];
    var ligneColor = [];
    for(var j=0;j <= NbrColonnes; j++){
        ligne.push(PropositionMot.value[j]);
    }

    this.GrilleMotus.splice(NbrCoups, 1, ligne);
    ligneColor = ComparaisonMot();
    this.tabColor.splice(NbrCoups, 1, ligneColor)
}

function AlimentationGrilleMotusNext(){
    var ligne = [];
    var ligneColor = [];
    ligne[0] = Mot[0];
    ligneColor.push('0');
    for(var j=1;j <= NbrColonnes; j++){
        if (this.MotEnCours[j] === 1){
            ligne.push(Mot[j]);
        }
        else{
            ligne.push('.');
        }
        ligneColor.push('0');
    }
    this.GrilleMotus.push(ligne);
    this.tabColor.push(ligneColor);
}

function AlimentationGrilleMotusLast(){
    var ligne = [];
    var ligneColor = [];
    for(var j=0;j <= NbrColonnes; j++){
        ligne.push(Mot[j]);
        ligneColor.push('3');
    }
    this.GrilleMotus.push(ligne);
    this.tabColor.push(ligneColor);
}

function ComparaisonMot(){
    var occurencesParLettre = this.occurencesParLettre;
    var tabColorComparaison = [];
    var BonneLettre = [];
    var MotADeviner = Mot.toUpperCase();
    var MotPropose = PropositionMot.value.toUpperCase();

    // Alimentation du tableau des bonnes lettres entre le mot proposé et le mot à deviner
    for (let i = 0; i < 7; i++){
        if (MotPropose[i] === MotADeviner[i]){
            BonneLettre[i] = 1;
            var n = occurencesParLettre.get(MotPropose[i]);
            n--;
            occurencesParLettre.set(MotPropose[i], n);
        }
        else BonneLettre[i] = 0;
    }

    // Alimentation du tableau des lettres déjà trouvées pour le prochain coup + couleur
    for (let i = 0; i < 7; i++){
        // Si la lettre proposé est correcte = lettre affichée pour le prochain coup + couleur verte
        if (BonneLettre[i] === 1){
            MotEnCours[i] = 1
            tabColorComparaison.push('2');
        }
        else{
            // Si le mot contient la lettre proposée mais pas au bon endroit
            if (occurencesParLettre.has(MotPropose[i])){

                // Récupération du nombre de fois que la lettre apparait dans le mot
                var n = occurencesParLettre.get(MotPropose[i]);

                // Si la lettre apparait au moins 1 fois dans le mot
                if (n > 0){

                    // On supprime une fois cette lettre dans les lettres présentes dans le mot + couleur orange
                    n--;
                    tabColorComparaison.push('1');
                }
                // Lettre non présente dans le mot = Couleur blanche
                else tabColorComparaison.push('0');
            } 
            // Lettre non présente dans le mot = Couleur blanche
            else tabColorComparaison.push('0');
        }
    }

    // Si mot trouvé alors fin du jeu
    if (MotADeviner === MotPropose){
        finJeu = true;
    }
    return tabColorComparaison;
}