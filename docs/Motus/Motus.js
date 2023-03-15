const Mot = 'bonjour';
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

    this.GrilleMotus = InitialisationGrilleMotus(NbrLignes, NbrColonnes, Mot[0]);
    afficherGrilleMotus(NbrCoups);
}

function InitialisationGrilleMotus(NbrLignes, NbrColonnes, PreLettre){
    var tab = [];
    var ligne = [];
    var ligneColor = [];

    // Init de la première lettre avec la couleur Vert
    ligne.push(PreLettre);
    ligneColor.push('2');

    // Boucle sur les 6 lettres suivantes pour les initialiser avec . et la couleur blanc
    for(var j=1;j < NbrColonnes; j++){
        ligne.push('.');
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
                //console.log("<td class=' border" + Color + "' width='50' height='50'>");
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
    ligneColor.push('2');
    for(var j=1;j <= NbrColonnes; j++){
        if (this.MotEnCours[j] === 1){
            ligne.push(Mot[j]);
            ligneColor.push('2');
        }
        else{
            ligne.push('.');
            ligneColor.push('0');
        }
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
    var tabColorComparaison = [];
    var MotADeviner = Mot.toUpperCase();
    var MotPropose = PropositionMot.value.toUpperCase();
    
    for(var i=0;i <= NbrColonnes; i++){

        // Alimentation du tableau des lettres déjà trouvées pour le prochain coup
        if (!(MotEnCours[i] === 1)){
            if ((MotPropose[i]) === MotADeviner[i]){
                MotEnCours[i] = 1;
            }
        }

        // Alimentation tableau des couleurs du mot proposé
        if ((MotPropose[i]) === MotADeviner[i]){
            tabColorComparaison.push('2');
        }
        else{
            tabColorComparaison.push('0'); 
        }
    }
    // Si mot trouvé alors fin du jeu
    if (MotADeviner === MotPropose){
        finJeu = true;
    }
    return tabColorComparaison;
}