interface Env {
  OPENAI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const formData = await request.formData();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are the rest api endpoint that responds only with JSON data.",
          },
          {
            role: "user",
            content: JSON.stringify({
              topic: "Formula 1 champion names to year",
              count: 3,
              front: {
                term: "year",
              },
              back: {
                term: "champion's name",
                lang: "en",
              },
            }),
          },
          {
            role: "assistant",
            content: JSON.stringify([
              [2007, "Kimi Räikkönen"],
              [2008, "Lewis Hamilton"],
              [2009, "Jenson Button"],
            ]),
          },
          {
            role: "user",
            content: JSON.stringify({
              topic: "Most popular Web development terms to translation",
              count: 4,
              front: { term: "term", lang: "ru" },
              back: { term: "translation", lang: "en" },
            }),
          },
          {
            role: "assistant",
            content: JSON.stringify([
              ["Запрос", "Request"],
              ["База данных", "Database"],
              ["Вебсайт", "Website"],
              ["Браузер", "Browser"],
            ]),
          },
          {
            role: "user",
            content: JSON.stringify({
              topic: "Most popular capital cities to countries",
              count: 2,
              front: { term: "city", lang: "ru" },
              back: { term: "country", lang: "ru" },
            }),
          },
          {
            role: "assistant",
            content: JSON.stringify([
              ["Вашингтон", "Соединённые Штаты Америки"],
              ["Лондон", "Англия"],
            ]),
          },
          {
            role: "user",
            content: JSON.stringify({
              topic: formData.get("topic"),
              count: Number(formData.get("count")) || 10,
              front: {
                term: formData.get("front-term"),
                ...(formData.get("front-lang")
                  ? { lang: formData.get("front-lang") }
                  : {}),
              },
              back: {
                term: formData.get("back-term"),
                ...(formData.get("back-lang")
                  ? { lang: formData.get("back-lang") }
                  : {}),
              },
            }),
          },
        ],
      }),
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-type": "application/json",
      },
    });

    const json = await response.json<any>();

    return new Response(json.choices[0].message.content, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
