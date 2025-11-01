// src/data/ww2Events.ts
export interface WW2Event {
  lat: number;
  lng: number;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  image: string;
  date: string; // use "YYYY-MM-DD" format
  color?: string;
}

export const ww2Events: WW2Event[] = [
  {
    lat: 48.80486,
    lng: 2.12023,
    title: "The Start of Paris Peace Conference",
    paragraph1:"The Paris Peace Conference, which commenced on 18 January 1919, was a pivotal moment in world history, marking the formal end of the First World War and shaping the political landscape of the 20th century. Convened in the aftermath of unprecedented global conflict and devastation, the conference brought together representatives from more than 30 nations with the primary goal of negotiating terms for peace and ensuring that such a catastrophic war would never occur again. The key players at the conference were the Allied Powers, especially the so-called “Big Four”: Woodrow Wilson of the United States, David Lloyd George of Great Britain, Georges Clemenceau of France, and Vittorio Orlando of Italy. Although many nations attended, these leaders wielded the greatest influence in determining the course of the negotiations.",
    paragraph2:"The conference aimed to address complex issues arising from the collapse of empires, such as those of Germany, Austria-Hungary, and the Ottoman Empire. Delegates focused on territorial disputes, reparations, disarmament, and the establishment of new national boundaries based on the principle of self-determination. Among the most significant achievements of the Paris Peace Conference was the formation of the League of Nations, Woodrow Wilson’s visionary proposal for an international organization designed to maintain global peace and foster diplomatic cooperation among nations. Although the League faced limitations, particularly with the United States’ refusal to join, its creation marked a landmark step toward collaborative global governance.",
    paragraph3:"One of the most debated outcomes of the conference was the Treaty of Versailles, which imposed harsh penalties and reparations on Germany. While intended to ensure lasting peace, these terms later contributed to economic hardship and political instability, ultimately paving the way for the rise of extremism and the outbreak of the Second World War. Thus, the Paris Peace Conference stands as both a moment of hope and a lesson in the complexities of peace-making in a world recovering from war.",
    image: "/images/paris_peace_conference.jpg",
    date: "1919-01-18",
    color: "red",
  },
  {
    lat: 48.80486,
    lng: 2.12023,
    title: "The Treaty of Versailles",
    paragraph1:"The Treaty of Versailles, signed on 28 June 1919, stands as one of the most significant and controversial peace agreements in modern history. It marked the formal conclusion of the First World War between Germany and the Allied Powers and represented the culmination of months of negotiation at the Paris Peace Conference. Signed exactly five years after the assassination of Archduke Franz Ferdinand—an event that triggered the war—the treaty sought to ensure peace and prevent another devastating global conflict. However, its terms would later spark intense debate and contribute to rising tensions in Europe.",
    paragraph2:"The treaty imposed severe political, military, and economic restrictions on Germany. One of its central provisions was the infamous “war guilt clause,” which placed full responsibility for the war on Germany and its allies. As a result, Germany was required to pay heavy reparations, a burden that strained its economy and contributed to widespread hardship among its people. The treaty also redrew the map of Europe by limiting German territory and sovereignty. Significant lands such as Alsace-Lorraine were returned to France, while new nations such as Poland were strengthened at Germany’s expense. Further, the German military was drastically reduced in size, and the nation was forbidden from building an air force, maintaining a navy beyond limited size, or stationing troops in certain regions like the Rhineland.",
    paragraph3:"In addition to punishing Germany, the Treaty of Versailles led to broader geopolitical changes. It established the League of Nations, an international body aimed at preventing future conflicts through diplomacy and collective security. While this represented a step toward global cooperation, the United States’ refusal to join weakened its effectiveness. Over time, resentment toward the treaty's harsh terms fueled political extremism in Germany and played a significant role in the rise of Adolf Hitler and the outbreak of the Second World War. Thus, although intended to secure lasting peace, the Treaty of Versailles remains a powerful reminder of the challenges and consequences of peace-making after war.",
    image: "/images/treatyversailles.jpg",
    date: "1919-06-28",
    color: "red",
  },
];
