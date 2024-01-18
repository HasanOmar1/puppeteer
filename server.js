import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const url = "https://fairytalez.com/region/maori/";

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:/ProgramData/Microsoft/Windows/Start Menu/Programs",
  });
  const page = await browser.newPage();
  await page.goto(url);

  const booksFromMaori = await page.evaluate(() => {
    const maoriBooks = Array.from(
      document.querySelectorAll(".alphabet-section li a")
    );

    return maoriBooks.map((book) => ({
      regionLink: book.href,
      regionName: book.innerText,
    }));
  });

  for (const content of booksFromMaori) {
    await page.goto(content.regionLink);

    const bookInfo = await page.evaluate(() => {
      const bookTitles = Array.from(document.querySelectorAll("article"));

      return bookTitles.map((book) => ({
        title: book.querySelector("header h1").innerText,
        content: Array.from(book.querySelectorAll(".entry p")).map(
          (para) => para.innerText
        ),
        img: book.querySelector(".entry img")?.getAttribute("src")
          ? book.querySelector(".entry img")?.getAttribute("src")
          : false,
      }));
    });
    // console.log(bookInfo);

    // const booksTitle = fs.readFileSync("./booksTitles.json", "utf-8");
    // let parsedBooks = JSON.parse(booksTitle);
    // parsedBooks = [...parsedBooks, ...bookInfo];
    // fs.writeFileSync("booksTitles.json", JSON.stringify(parsedBooks));
  }

  await browser.close();
};

main();

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
