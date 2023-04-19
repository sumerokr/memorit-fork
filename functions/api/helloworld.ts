interface Env {
  OPENAI_API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "You are the rest api endpoint that responds only with JSON data.",
        },
        {
          role: "user",
          content: {
            topic: "Formula 1",
            cards: 3,
            front: {
              term: "year",
            },
            back: {
              term: "champion's name",
              lang: "en",
            },
          },
        },
        {
          role: "assistant",
          content: [
            [2007, "Kimi Räikkönen"],
            [2008, "Lewis Hamilton"],
            [2009, "Jenson Button"],
          ],
        },
        {
          role: "user",
          content:
            '{"topic":"Most popular Frontend development terms","cards":3,"front":{"term":"term","lang":"ru"},"back":{"term":"translation","lang":"en"}}',
        },
        {
          role: "assistant",
          content:
            '[["Вёрстка", "Markup"], ["База данных", "Database"], ["Вебсайт", "Website"]]',
        },
        {
          role: "user",
          content:
            '{"topic":"Most popular capital cities","cards":3,"front":{"term":"city","lang":"ru"},"back":{"term":"country","lang":"ru"}}',
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-type": "application/json",
    },
  });

  const json = await response.json<any>();

  return new Response(
    JSON.stringify({
      method: "sendMessage",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};
