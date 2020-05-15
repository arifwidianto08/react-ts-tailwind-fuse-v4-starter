import { fusebox, sparky, pluginPostCSS, pluginCSS } from "fuse-box";
import { generateSW } from "workbox-build";

class Context {
  isProduction: boolean;
  runServer: boolean;
  getConfig() {
    return fusebox({
      target: "browser",
      entry: "src/index.tsx",
      compilerOptions: {
        tsConfig: "tsconfig.json",
      },
      webIndex: {
        template: "src/public/index.html",
      },
      cache: {
        root: ".cache",
        enabled: true,
      },
      env: { NODE_ENV: this.isProduction ? "production" : "development" },
      hmr: {
        enabled: !this.isProduction,
      },
      devServer: this.runServer,
      logging: { level: "succinct" },
      watcher: {
        include: ["./src/**"],
      },
      plugins: [
        pluginPostCSS([require("tailwindcss"), require("autoprefixer")] as any),
        pluginCSS(),
      ] as any,
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

task("default", async (ctx) => {
  ctx.runServer = true;
  ctx.isProduction = false;
  const fuse = ctx.getConfig();
  await fuse.runDev({ uglify: true });
});

task("preview", async (ctx) => {
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});

task("sw", async () => {
  await generateSW({
    swDest: "dist/service-worker.js",
    globDirectory: "dist/",
    globPatterns: ["**/*.{js,png,css,json,html}"],
  });
});

task("build-prod", async (ctx) => {
  await exec("clean");

  ctx.runServer = false;
  ctx.isProduction = true;

  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true });
});

task("dist", async () => {
  await exec("build-prod");
  await exec("sw");
});

task("clean", async () => {
  await rm("./dist");
  await rm("./fusebox");
});
