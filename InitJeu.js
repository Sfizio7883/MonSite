var InitJeu = {

    initialiserMotus : function(){
        var tab = [];
        for(var i=0;i < nbLigne;i++){
            var ligne = [];
            for(var j=0;j < nbColonne; j++){
                ligne.push(car);
            }
            tab.push(ligne);
        }
        return tab;
    }
}