"use client";
import CityCard from "@/components/cityCard";
import CityComparator from "@/components/cityComparator";
import CityInformation from "@/components/cityInformation";
import FilterForm from "@/components/filterForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { regions } from "@/lib/constants/regions";
import { useFilterStore } from "@/store/filterStore";
import { City } from "@/utils/types/city";
import { GeoJsonLoader, Map, Marker, Overlay } from "pigeon-maps";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const cities = [
  {
    coordinates: {
      long: 5.25,
      lat: 45.85,
    },
    cityName: "BLYES",
    postalCode: "01150",
    totalNotes: 0,
    note: {
      globalNote: 7.56,
      environment: 8,
      transports: 6,
      security: 8,
      health: 5,
      sportsAndLeisure: 7,
      culture: 4,
      education: 9,
      shops: 2,
      lifeQuality: 9,
    },
    reviews: [
      {
        date: "09-11-2018",
        positif:
          "Les points positifs : -Un environnement naturel, peu pollué (très bonne qualité de l'air) et sain malgré la zone industrielle proche ;\n-Un climat de civilité et de bon-vivre;\n-Des petites villes alentours (10 min ou moins) proposant tout le nécessaire en matière de santé, d'éducation, d'histoire (de nombreux points d'intérêt historique), de commerces, et de gares pour aller à Lyon;\n-Pas de racaille ou de délinquance, c'est sécurité totale;\n-Piscine et une salle de sport à 5 min de voiture;",
        negatif:
          "Les points négatifs : -La zone industrielle proche;\n-Peu de transports intra muros (seulement pour les écoles), donc voiture obligatoire;\n-Village peu développé, quasi obligation de prendre la voiture pour accéder aux commerces, à la santé, culture etc;\n-Village qui se développe de plus en plus vite car dans la périphérie lyonnaise.... Ce qui fait son charme ne durera peut être pas.",
        peopleAgree: 0,
        peopleDisagree: 0,
        note: {
          globalNote: 7.56,
          environment: 8,
          transports: 6,
          security: 8,
          health: 5,
          sportsAndLeisure: 7,
          culture: 4,
          education: 9,
          shops: 2,
          lifeQuality: 9,
        },
      },
    ],
  },
  {
    coordinates: {
      long: 5.35,
      lat: 45.95,
    },
    cityName: "AMBERIEU EN BUGEY",
    postalCode: "01500",
    totalNotes: 24,
    note: {
      globalNote: 6.05,
      environment: 6.29,
      transports: 6.5,
      security: 4.58,
      health: 6,
      sportsAndLeisure: 7.38,
      culture: 5.33,
      education: 6.21,
      shops: 6.46,
      lifeQuality: 6,
    },
    reviews: [
      {
        date: "06-04-2025",
        positif:
          "Les points positifs : L'accès multimodal. le point central dans la région. Un ciné accessible pour tout le monde.",
        negatif:
          "Les points négatifs : Les poubelles et les voiture dominent la ville. Les nids de poules aussi. Ville dortoir. Absence de soutiens réels aux écoles. Ville qui se bétonnise sans amélioration des conditions de vie. Manque de culture et de médecin.\n\nAdresse email invalide !!",
        peopleAgree: 0,
        peopleDisagree: 0,
        note: {
          globalNote: 5.31,
          environment: 3,
          transports: 8,
          security: 6,
          health: 8,
          sportsAndLeisure: 8,
          culture: 7,
          education: 6,
          shops: 7,
          lifeQuality: 4,
        },
      },
      {
        date: "04-09-2022",
        positif:
          "Les points positifs : Résidents depuis 1 an,  assez contents d'être au calme comparé à Lyon,  la vue depuis notre maison est super,  le quartier est calme,  on est proches de toutes les commodités,  ça permet vraiment de déconnecter de la vie professionnelle le week-end. C'est près de beaucoup de destinations en voiture donc on ne peut pas s'en plaindre.\nLa gare permet de rejoindre Lyon en 20mn, et a enfin des ascenseurs depuis l'été dernier donc c'est top pour les trottinettes lourdes.\nIl y a parfois des sdf dans le centre ville et devant les commerces mais ils ne nous ont jamais importunés donc c'est tout de même un bon point.\nLe restaurant chinois à côté de la gare est absolument succulent.",
        negatif:
          "Les points négatifs : Les routes sont très abîmées,  ça oblige sur certaines portions à rouler doucement sur les trottoirs pour sa sécurité. Nous avons interpellé le maire qui s'est contenté de dire qu'il n'avait pas de budget pour rénover les voiries ou créer davantage de pistes cyclables menant à la gare.\nToujours pas de fibre optique dans notre quartier alors que c'était promis depuis 1 an,  débit ADSL 12M, donc insatisfaisant.\nTout ferme à 19h/20h donc quand on rentre du travail en train le soir,  impossible d'aller faire des courses,  il faut attendre le week-end ! Les prix sont plus chers qu'à Lyon (courses,  boucherie,  boulangerie,  manucure etc),  nous avons testé tous les commerces,  et la qualité est pourtant légèrement en dessous par rapport à Lyon. Donc il faut avoir les finances solides.\nEnfin,  pas beaucoup de bars ou boîtes pour aller boire un verre ou passer une bonne soirée,  c'est dommage. J'espère que ça va se développer.",
        peopleAgree: 5,
        peopleDisagree: 1,
        note: {
          globalNote: 6.75,
          environment: 8,
          transports: 6,
          security: 7,
          health: 7,
          sportsAndLeisure: 6,
          culture: 5,
          education: 6,
          shops: 7,
          lifeQuality: 7,
        },
      },
      {
        date: "28-05-2021",
        positif:
          "Les points positifs : Les gens sont sympa et pas stressés,  c'est super agréable et même surprenant au début (nos réflexes de citadins). On rencontre facilement du monde et l'entraide se fait naturellement sur les petits trucs du quotidien.  De plus,  nous avons rencontré beaucoup de gens sensibles à la protection de la nature et à la consommation durable.  Il y a d'ailleurs,   plusieurs associations/commerces qui développent et propagent ces idées. Côté commerces,  il y a tout ce qu'il faut, pour les commerces de bouche,  il y en a pas mal de très grande qualité. La nature tout à côté avec des balades à faire à pied ou en vélo. L'hiver,   le ski/luge est à 30 min avec le plateau d'Hauteville. Et Lyon très bien desservi en train,  vous y êtes en 20 min.\nEn plus,  cette ville a un enseignement privé et public qui va de la maternelle au Lycée.\nUne vie associative hyper dense et toutes les activités extrascolaires pour enfants et adultes que vous pouvez souhaiter.",
        negatif:
          "Les points négatifs : À part l'architecture qui n'est pas folle,  sinon je ne vois pas. Apres toutes les villes ne ressemblent pas aux cœurs historiques de Bordeaux,   Lyon ou Paris.\nDe plus,  un beau projet de rénovation du quartier gare est en cours.",
        peopleAgree: 3,
        peopleDisagree: 3,
        note: {
          globalNote: 9,
          environment: 7,
          transports: 6,
          security: 9,
          health: 9,
          sportsAndLeisure: 10,
          culture: 7,
          education: 8,
          shops: 8,
          lifeQuality: 10,
        },
      },
      {
        date: "26-05-2021",
        positif:
          "Les points positifs : Ville jeune et dynamique qui est en train de se transformer avec l'arrivée de nouvelles familles venant chercher un cadre de vie privilégié alliant nature et vie urbaine. \nIl y a beaucoup d'associations et d'activités extra-scolaires. Les gens sont sympas et se lient facilement.",
        negatif:
          "Les points négatifs : La ville en elle-même n'est pas jolie mais le quartier gare est en cours de réaménagement.",
        peopleAgree: 4,
        peopleDisagree: 1,
        note: {
          globalNote: 8.75,
          environment: 0,
          transports: 8,
          security: 9,
          health: 9,
          sportsAndLeisure: 10,
          culture: 8,
          education: 8,
          shops: 8,
          lifeQuality: 10,
        },
      },
      {
        date: "17-03-2021",
        positif:
          "Les points positifs : Au pied de la forêt et des montagnes. \nSécurité,  magasins suffisants,  habitants sympas. \nÀ côté de Lyon via le train (20 min de la part dieu) sortie d'autoroute à côté. \nÀ 1h30 des Alpes et 30 min de Hauteville. \nBref pour les familles aimants le sport,  la nature et une vie paisible,  c'est top.\nNb: une vie associative hyper dynamique (MJC et autres) toutes les activités extra scolaires sont proposées sur Ambérieu-en-Bugey.",
        negatif:
          "Les points négatifs : L'architecture des bâtiments n'est pas top. Toutefois,  un projet de modernisation est en cours quartier gare.\nPistes cyclables de plus en plus présentes mais ce point est encore à développer.",
        peopleAgree: 5,
        peopleDisagree: 2,
        note: {
          globalNote: 8.38,
          environment: 7,
          transports: 5,
          security: 9,
          health: 8,
          sportsAndLeisure: 10,
          culture: 7,
          education: 8,
          shops: 8,
          lifeQuality: 9,
        },
      },
      {
        date: "27-12-2020",
        positif:
          "Les points positifs : Ayant emménagés il y a quelques mois nous ne voyons que du positif pour l'instant.\nJ'ai du mal à comprendre les commentaires parlant d'incivilité et d'insécurité car au contraire nous sommes surpris par la politesse et la courtoisie des habitants.\nAyant habité Villeurbanne et la région parisienne, Ambérieu est loin d'être une ville ou règne l'insécurité.\nCadre de vie agréable avec de grands espaces et beaux paysages à proximité.\nSituation géographique très pratique pour aller travailler à Lyon ou Bourg avec accès rapide via le train ou l'autoroute. \nUne zone commerciale et un centre ville avec suffisamment de commerces et des commerçants agréables. \nNiveau sport et culture, impossible d'évaluer ce critère pour l'instant cause covid!",
        negatif:
          "Les points négatifs : Le seul petit bémol pour l'instant c'est la difficulté à avoir des rendez vous médicaux car temps d'attente important et beaucoup de praticiens qui ne prennent plus de nouveaux patients.",
        peopleAgree: 8,
        peopleDisagree: 5,
        note: {
          globalNote: 8.31,
          environment: 9,
          transports: 8,
          security: 8,
          health: 6,
          sportsAndLeisure: 7,
          culture: 7,
          education: 7,
          shops: 9,
          lifeQuality: 9,
        },
      },
      {
        date: "30-09-2020",
        positif:
          "Les points positifs : Au pied des bois et des petites montagnes du Bugey.\nCentre commercial et magasins du centre correctes\nVille relativement agréable et sympathique.",
        negatif:
          "Les points négatifs : La circulation est horrible pour une ville de 15000hab.\nDur dur de circuler aux horaires de sortie de sainte Marie. Et des écoles en général.\nInsécurité croissante au centre ville et en gare le soir. Incivilités récurrentes impunies. Un certain laxisme des forces de l'ordre pour la petite délinquance.",
        peopleAgree: 15,
        peopleDisagree: 5,
        note: {
          globalNote: 6.38,
          environment: 8,
          transports: 3,
          security: 3,
          health: 6,
          sportsAndLeisure: 8,
          culture: 6,
          education: 5,
          shops: 7,
          lifeQuality: 7,
        },
      },
      {
        date: "02-08-2020",
        positif:
          "Les points positifs : La ville est très bien située géographiquement et permet de s'évader facilement dans la nature.\n\nLes infrastructures sportives sont bonnes.\n\nIl y a une gare. Il faut juste trouver une place pour garer sa voiture.",
        negatif:
          "Les points négatifs : Le niveau des commerces est faible et des punks à chiens alcoolisés font le siège devant le centre commercial Carrefour market.\n\nJ'habite dans le quartier de Vareilles depuis 12 ans et l'urbanisation non maîtrisée a rendu la circulation impossible.\n\nJe vois les gendarmes promener leurs voitures mais ils ne font jamais de contrôles de vitesse ou de contrôles sonores. Et il y a beaucoup à faire...\n\nLe maire actuel n'a rien apporté à la ville et a augmenté la taxe d'habitation.\nLe service de la mairie est mauvais.\nLa ville est sale.",
        peopleAgree: 21,
        peopleDisagree: 6,
        note: {
          globalNote: 3.25,
          environment: 5,
          transports: 5,
          security: 2,
          health: 3,
          sportsAndLeisure: 8,
          culture: 5,
          education: 5,
          shops: 3,
          lifeQuality: 2,
        },
      },
      {
        date: "15-07-2020",
        positif:
          "Les points positifs : Situé dans un axe Lyon Genève, bien desservi.\nÉquipements sportifs globalement bons\nPromenades aux alentours\nVillages sympathiques à proximité.",
        negatif:
          "Les points négatifs : Insécurité, nuisances, problèmes communautaires, mendicité agressive, ici on laisse tout faire\nRoutes en très mauvais état, attention vos pneus.\nVoirie sale\nParc digne d'un village de 200 hab, il faut se déplacer dans les petits villages autour pour divertir ses enfants et échapper à la délinquance\nA fuir, sauf sur les hauteurs.",
        peopleAgree: 13,
        peopleDisagree: 5,
        note: {
          globalNote: 3.75,
          environment: 2,
          transports: 6,
          security: 0,
          health: 7,
          sportsAndLeisure: 8,
          culture: 7,
          education: 7,
          shops: 7,
          lifeQuality: 2,
        },
      },
      {
        date: "13-01-2020",
        positif:
          "Les points positifs : Ambérieu-en-Bugey possède des transports internes difficiles en raison d'une urbanisation particulière mais est très bien desservie sur le plan ferroviaire entre Lyon, la Savoie et la Bresse. Ambérieu-en-Bugey dispose d'un hôpital convenable (HPA) et un laboratoire d'analyse efficace. Toute la santé est regroupée dans le secteur nord de la ville. La ville est située dans un cadre naturel sympathique et la commune possède le Château des Allymes qui mérite le détour.",
        negatif:
          "Les points négatifs : Ambérieu-en-Bugey est hétérogène et il s'agit d'une ville laide. Ambérieu ne forme pas un sentiment général de sécurité. Ambérieu dispose d'un collège et d'un lycée tous les deux déplorables.",
        peopleAgree: 19,
        peopleDisagree: 4,
        note: {
          globalNote: 2.81,
          environment: 4,
          transports: 6,
          security: 2,
          health: 7,
          sportsAndLeisure: 7,
          culture: 5,
          education: 1,
          shops: 5,
          lifeQuality: 1,
        },
      },
      {
        date: "19-11-2019",
        positif:
          "Les points positifs : Les transports sont assez pratiques, les parcs sont entretenus. \nL'hôpital devenu privé a une meilleur réputation. \nLe cinéma et la médiathèque sont complets.\nNombreux commerces notamment vers Intermarché.",
        negatif:
          "Les points négatifs : Trop de deal, les écoles sont surchargées, les HLM sont partout, la sécurité laisse à désirer. ",
        peopleAgree: 15,
        peopleDisagree: 4,
        note: {
          globalNote: 4.56,
          environment: 7,
          transports: 9,
          security: 4,
          health: 4,
          sportsAndLeisure: 6,
          culture: 3,
          education: 2,
          shops: 6,
          lifeQuality: 4,
        },
      },
      {
        date: "09-10-2019",
        positif:
          "Les points positifs : Espace vert, bibliothèque, école et lycée, gare.",
        negatif:
          "Les points négatifs : Sécurité nulle, pas assez de loisir, culture. .. Hôpital de mauvaise réputation,, trop de monde, quartier gare inquiétant, trop de constructions presque inutiles, lycée surchargé et collège aussi, peu de magasins, beaucoup trop d'opticiens.",
        peopleAgree: 17,
        peopleDisagree: 4,
        note: {
          globalNote: 3.31,
          environment: 4,
          transports: 3,
          security: 1,
          health: 1,
          sportsAndLeisure: 4,
          culture: 6,
          education: 4,
          shops: 6,
          lifeQuality: 3,
        },
      },
      {
        date: "24-01-2017",
        positif:
          "Les points positifs : J'adore!!! Il fait bon vivre ici.\nCertes, la ville n'est pas des plus belles dans les environs, mais il y a tout ce qu'il faut (commerces, activités sportives, culturelles...) et les alentours sont supers!\nSi vous aimez la nature, les randos, l'accrobranche, les via Ferrata, le ski (oui... les stations les plus proches sont à 30min, petite station familiale)) tout en ayant les commodités d'une ville, amberieu est faite pour vous!\nDe plus elle est idéalement placée: proche de la montagne et à 25min en train de Lyon!",
        negatif:
          "Les points négatifs : Quartier gare mériterait d'être aménagé",
        peopleAgree: 15,
        peopleDisagree: 17,
        note: {
          globalNote: 9.44,
          environment: 10,
          transports: 7,
          security: 9,
          health: 9,
          sportsAndLeisure: 9,
          culture: 10,
          education: 9,
          shops: 8,
          lifeQuality: 10,
        },
      },
      {
        date: "05-11-2016",
        positif: "Les points positifs : Aucun",
        negatif:
          "Les points négatifs : Tous les inconvénients d'une \"grande\" ville, aucun avantage.\nDes logements qui sortent de terre à tout instant, des infrastructures dépassées par ce développement, un maire qui se voile la face et qui n'écoute pas ses administrés, ville sale, trottoirs servant de déchetterie, insécurité, j'en passe et des meilleurs.",
        peopleAgree: 27,
        peopleDisagree: 12,
        note: {
          globalNote: 2.56,
          environment: 1,
          transports: 5,
          security: 1,
          health: 3,
          sportsAndLeisure: 5,
          culture: 5,
          education: 8,
          shops: 5,
          lifeQuality: 1,
        },
      },
      {
        date: "07-08-2016",
        positif:
          "Les points positifs : c'est calme, il y a une gare, un ciné...",
        negatif:
          "Les points négatifs : c'est trop étendu, pas de vrai centre-ville : il faut prendre la voiture pour le moindre achat ! il n'y a pas de piscine extérieure : dommage car nous sommes dans le sud... pas de médiathèque",
        peopleAgree: 9,
        peopleDisagree: 11,
        note: {
          globalNote: 5.94,
          environment: 5,
          transports: 5,
          security: 6,
          health: 6,
          sportsAndLeisure: 7,
          culture: 6,
          education: 6,
          shops: 6,
          lifeQuality: 6,
        },
      },
      {
        date: "30-12-2015",
        positif:
          "Les points positifs : très concentrée, proche de tout, on y trouve tout ce qu'il faut.",
        negatif:
          "Les points négatifs : très concentrée. \nUne sécurité inexistante, c'est un peu 'ok corral'la nuit.\nUne ville qui donne parfois l'impression d'être dirigée par un conseil de commerçants et non municipal ce qui fait que beaucoup d'événements sont directement liés à tel ou tel commerce de la ville et ont pour seul objectif: publicité et gains.\nCulturellement, on a la mjc qui joue des pieds et des mains pour apporter quelques contenus décents sans quoi il ne s'y passe rien absolument rien résolument rien qui puisse nourrir l'esprit. Tout n'est question que de commerce. \nAu niveau de l'emploi, [...] heureusement il y a la plaine de l'Ain et les villes Lyon et bourg-en-bresse à portée de train. on serait presque impressionné de voir qu'une ville aussi fournie n'apporte si peu de possibilités professionnelles.\nPour finir l'ambarrois moyen est une créature relativement sauvage. Elle ne mord pas, n'agresse pas mais elle a des doigts à la place des yeux et adore vous contempler aussi banal puissiez vous être. L'ambarrois adore observer sans retenu son prochain mais ce qu'il préfère c'est parader, briller, montrer aux autres comme il est beau. \nGéographiquement, j'ai fait le sud le nord et le centre de la France, Amberieu en bugey n'arrive clairement pas dans mon top 10.",
        peopleAgree: 16,
        peopleDisagree: 6,
        note: {
          globalNote: 5.13,
          environment: 7,
          transports: 6,
          security: 3,
          health: 6,
          sportsAndLeisure: 6,
          culture: 4,
          education: 5,
          shops: 5,
          lifeQuality: 5,
        },
      },
      {
        date: "23-10-2015",
        positif:
          "Les points positifs : je suis Ambarrois de souche et j'aime ma ville",
        negatif:
          "Les points négatifs : le quartier gare qui à été abandonné par les municipalités successives, les transport type TAM qu'il faudrait développer en intercommunalité.",
        peopleAgree: 2,
        peopleDisagree: 5,
        note: {
          globalNote: 7.81,
          environment: 10,
          transports: 7,
          security: 2,
          health: 4,
          sportsAndLeisure: 6,
          culture: 1,
          education: 8,
          shops: 7,
          lifeQuality: 10,
        },
      },
      {
        date: "11-01-2015",
        positif:
          "Les points positifs : malgré l'augmentation de la population, Ambérieu conserve son âme de village.",
        negatif:
          "Les points négatifs : trop d'invasion étrangère depuis quelques années. Il faudrait rester vigilant à conserver un quota ne pouvant nuire au bon équilibre d'une entente cordiale entre communautés.",
        peopleAgree: 32,
        peopleDisagree: 10,
        note: {
          globalNote: 7.06,
          environment: 8,
          transports: 8,
          security: 5,
          health: 6,
          sportsAndLeisure: 8,
          culture: 7,
          education: 7,
          shops: 8,
          lifeQuality: 7,
        },
      },
      {
        date: "02-11-2014",
        positif:
          "Les points positifs : ville agréable car proche de tout on s y sent bien;très convivial, au bout de quelques mois à Ambérieu, on a connu plein de gens très sympas et très accueillants.",
        negatif:
          "Les points négatifs : Une faune très particulière dans le secteur de la gare; une police municipale absolument infecte pas de parking pour se garer; La police municipale qui ferme les yeux sur le parking de la gare",
        peopleAgree: 13,
        peopleDisagree: 0,
        note: {
          globalNote: 6.88,
          environment: 10,
          transports: 5,
          security: 2,
          health: 5,
          sportsAndLeisure: 8,
          culture: 1,
          education: 8,
          shops: 7,
          lifeQuality: 8,
        },
      },
      {
        date: "03-07-2014",
        positif:
          "Les points positifs : on est très vite a lyon \nproximité de Genève et des aéroports \nla nature environnante très belle \nles lycées",
        negatif:
          "Les points négatifs : une police municipale absolument infecte \npas de parking pour se garer \nle néant au niveau culture et sorties le soir ,pas de boite ,un seul pub glauque \nle néant au niveau commerce \nle néant au niveau restauration \nune clinique qui a très mauvaise réputation justifiée pour etre allee aux urgence plusieurs fois",
        peopleAgree: 23,
        peopleDisagree: 3,
        note: {
          globalNote: 5.94,
          environment: 9,
          transports: 10,
          security: 9,
          health: 9,
          sportsAndLeisure: 10,
          culture: 0,
          education: 8,
          shops: 0,
          lifeQuality: 5,
        },
      },
      {
        date: "14-05-2014",
        positif:
          "Les points positifs : A 20/25 minutes de Lyon part Dieu par le train, cadre sympathique. A proximité de la vallée de l'Albarine pour les sportifs.",
        negatif:
          "Les points négatifs : Beaucoup d'Ambarrois (Lyonnais ?) sont portés par le paraître, mytho sur les bords, gros manque d'humilité chez une minorité visible mais fatigante à écouter. Une faune très particulière dans le secteur de la gare.",
        peopleAgree: 18,
        peopleDisagree: 1,
        note: {
          globalNote: 5.88,
          environment: 6,
          transports: 9,
          security: 3,
          health: 8,
          sportsAndLeisure: 9,
          culture: 5,
          education: 7,
          shops: 7,
          lifeQuality: 5,
        },
      },
      {
        date: "12-04-2014",
        positif: "Les points positifs : Le lycée solaire",
        negatif:
          "Les points négatifs : La police municipale qui ferme les yeux sur le parking de la gare",
        peopleAgree: 16,
        peopleDisagree: 0,
        note: {
          globalNote: 4.5,
          environment: 5,
          transports: 4,
          security: 0,
          health: 4,
          sportsAndLeisure: 4,
          culture: 3,
          education: 6,
          shops: 6,
          lifeQuality: 5,
        },
      },
      {
        date: "14-03-2014",
        positif:
          "Les points positifs : ville agreable car proche de tout\non s y sent bien",
        negatif: "Les points négatifs : manque de charme et a grossi trop vite",
        peopleAgree: 6,
        peopleDisagree: 2,
        note: {
          globalNote: 6.69,
          environment: 8,
          transports: 8,
          security: 6,
          health: 5,
          sportsAndLeisure: 6,
          culture: 6,
          education: 5,
          shops: 7,
          lifeQuality: 7,
        },
      },
      {
        date: "05-01-2014",
        positif:
          "Les points positifs : très convivial, au bout de qques mois à Ambérieu, on a connu plein de gens très sympas et très accueillants (chez les ambarois \"de souche\"), contrairement à Lyon où il est très difficile de lier. Plein de petits commerces sympa, en général pas besoin d'aller plus loin. La nature tout à côté avec des balades à faire à pied ou en vélo. Lyon très bien desservi en train et un service de bus de ville pour ceux qui n'ont pas de voiture.",
        negatif:
          "Les points négatifs : La clinique ici a une très mauvaise réputation. C'est aussi une ville où il y a beaucoup de kékés et de midinettes (beaucoup d'ongleries par habitant), il faut cohabiter!",
        peopleAgree: 10,
        peopleDisagree: 2,
        note: {
          globalNote: 6.75,
          environment: 8,
          transports: 9,
          security: 4,
          health: 4,
          sportsAndLeisure: 7,
          culture: 7,
          education: 5,
          shops: 8,
          lifeQuality: 7,
        },
      },
    ],
  },
];

const departements = {
  "09": 0.5,
  "11": 0.7,
  "12": 0.1,
  "30": 0.8,
  "34": 0.6,
  "31": 0.4,
  "32": 0.9,
  "46": 0.1,
};

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [comparator, setComparator] = useState<City[]>([]);
  const [selectedCityInformation, setSelectedCityInformation] =
    useState<City | null>(null);
  const [comparatorOpen, setComparatorOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  useEffect(() => {
    if (comparator.length === 0) {
      setComparatorOpen(false);
    }
  }, [comparator]);

  const region = useFilterStore((state) => state.region);

  const [coord, setCoord] = useState<[number, number]>([43.4637, 2.145]);
  useEffect(() => {
    const data = regions.find((el) => el.name === region);
    console.log("oui", data);
    if (data) {
      setCoord([data.lat, data.lon]);
      fetch(`api/avis/regions/${region}`).then(async (res) => {
        const dataCities = await res.json();
        setCities(dataCities);
      });
    }
  }, [region]);
  return (
    <div className="w-screen h-screen relative">
      <Button
        className="absolute top-4 right-4 z-50 bg-white rounded-4xl text-black py-6 px-8 hover:bg-slate-200 cursor-pointer"
        disabled={comparator.length === 0}
        onClick={() => {
          setComparatorOpen(true);
        }}
      >
        Comparer ({comparator.length} villes)
      </Button>
      <CityComparator
        cities={comparator}
        open={comparatorOpen}
        onClose={() => setComparatorOpen(false)}
        onRemoveCity={(index) => {
          setComparator((curr) => {
            const copy = [...curr];
            copy.splice(index, 1);
            return copy;
          });
        }}
      />
      <Card className="absolute z-50 top-4 left-4 p-4">
        <FilterForm />
      </Card>
      {selectedCityInformation && (
        <CityInformation
          city={selectedCityInformation}
          onClose={() => {
            setSelectedCityInformation(null);
          }}
        />
      )}
      <Map
        center={coord}
        defaultZoom={8}
        onClick={() => {
          setSelectedCity(null);
        }}
      >
        {region && (
          <GeoJsonLoader
            link={`/api/geojson/regions/${region}`}
            styleCallback={(feature, hover) => {
              let color = "#93c0d099";
              const intensity = departements[feature.properties.code];
              if (intensity) {
                if (intensity < 0.33) color = "rgba(255, 10, 0, 0.7)";
                else if (intensity < 0.66) color = "rgba(255, 165, 0, 0.7)";
                else color = "rgba(60, 179, 113, 0.7)";
              }
              // return hover
              //   ? { fill: "#93c0d099", strokeWidth: "2" }
              return { fill: color, strokeWidth: "1", stroke: "grey" };
            }}
          />
        )}
        {cities.map(({ coodonnees: { long, lat } }, index) => (
          <Marker
            key={`${long}-${lat}`}
            width={50}
            anchor={[lat, long]}
            onClick={() => {
              setSelectedCity(cities[index]);
            }}
          />
        ))}
        {selectedCity != null && (
          <Overlay
            anchor={[
              selectedCity.coodonnees.lat,
              selectedCity.coodonnees.long,
            ]}
          >
            <CityCard
              cityName={selectedCity.nom}
              onAddToComparator={() => {
                if (
                  !comparator.find(
                    (city) =>
                      city.nom === selectedCity.nom &&
                      city.code === selectedCity.code
                  )
                ) {
                  setComparator((curr) => [...curr, selectedCity]);
                  toast(
                    `Vous venez d'ajouter ${selectedCity.nom} au comparateur`
                  );
                } else {
                  toast(
                    `${selectedCity.nom} est déjà ajouté au comparateur`
                  );
                }
                setSelectedCity(null);
              }}
              onMoreInformation={() => {
                setSelectedCityInformation(selectedCity);
                setSelectedCity(null);
              }}
            />
          </Overlay>
        )}
      </Map>
    </div>
  );
}
