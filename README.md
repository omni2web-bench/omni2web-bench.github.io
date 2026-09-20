# Omni2Web project page

A static project page for **Omni2Web: Benchmarking Audiovisual Website Development**. It includes the authors, paper, benchmark overview, three evaluation tracks, searchable and sortable main results, and a BibTeX citation.

No Node.js build, external font service, analytics, or API key is required. Fonts, figures, model logos, results, and the paper are served locally. All asset links are relative, so the page works under either a GitHub Pages project path or a domain root.

## Transfer and commit from another computer

Copy this entire folder to a computer with access to the private repository:

`https://github.com/omni2web-bench/omni2web-bench.github.io`

Include the hidden `.github/`, `.gitignore`, and `.nojekyll` entries. The page is self-contained; the parent paper directory is not needed.

For an empty remote repository, run the following **inside this folder**:

```bash
git init -b main
git add .
git commit -m "Add Omni2Web project page"
git remote add origin https://github.com/omni2web-bench/omni2web-bench.github.io.git
git push -u origin main
```

If the remote repository already has commits, clone it first and copy this folder's contents into the clone, keeping the clone's `.git/` directory. Commit and push normally without force-pushing.

The website files belong at the repository root, with `index.html` directly at the top level. Keep the repository private and Pages disabled for now. The intended public URL is `https://omni2web-bench.github.io/`; setting this URL does not publish the site.

## Preview

From this directory:

```bash
python -m http.server 8860 --bind 127.0.0.1
```

Open `http://localhost:8860`. For a remote development machine, forward port 8860 in your editor or SSH connection.

## Prepare privately

Keep the GitHub repository **Private** and leave GitHub Pages disabled while preparing the paper. Use the local preview above; its server binds only to the loopback interface.

Pushing source changes does not deploy the site. The deployment workflow requires a manual run, a public repository, and the repository variable `ENABLE_PUBLIC_PAGES` set to `true`. Leave that variable unset during private preparation.

A private source repository does not by itself make a deployed GitHub Pages site private. This project therefore keeps Pages off until the public release.

## Configure public links

Set the project URL, code repository, and dataset URL in `site-config.js`. Links with a `null` value remain marked as coming soon. The paper link defaults to `assets/omni2web-paper.pdf`.

The citation intentionally has no arXiv identifier until one is assigned. Add the identifier and public URL when available.

## Publish with GitHub Pages

After the arXiv submission and when ready to publish:

1. Update the paper PDF, citation, and resource links, then make the intended GitHub repository public. The contents of this directory should be at the repository root on `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. In **Settings → Secrets and variables → Actions → Variables**, add `ENABLE_PUBLIC_PAGES` with value `true`.
4. Run **Deploy project page** manually from **Actions**, selecting `main`.
5. Use the URL shown by the successful deployment as the project link in the arXiv paper.

The included workflow publishes only the static page and `assets/`. Later updates also require a manual workflow run.

## Update content

- `index.html`: page text, authors, metric explanations, and citation.
- `styles.css`: layout and the navy / blue / coral / teal palette shared with the paper.
- `assets/omni2web-o.svg`: the original illustrated initial, combining a navy O, a teal speech trace, and an orange cursor. It replaces the first letter in the hero, navigation, and footer; `assets/favicon.svg` uses the same design.
- `assets/results.js`: leaderboard scores on a 0–100 scale; unavailable values are `null`. Fields `a` and `c` are EFS, `b` is IRS, and `niu` is Track C's normalized instruction utility. The page derives model counts, best scores, and comparison bars from this file. Keep the fallback values in `index.html` aligned when editing it.
- `assets/overview.png` and `assets/anatomy.png`: web versions of Figures 1 and 2.
- `assets/omni2web-paper.pdf`: the arXiv version of the paper.

The leaderboard contains the paper's 17 models and six additional evaluations: Gemini 3.6 Flash, Gemini 3.7 Flash, Gemini 3.8 Flash, Muse Spark 1.2, Qwen3.8-Omni-Flash, and Qwen3.8-Omni-Flash-Realtime. All six use the same 918 instances and DeepSeek-v4-pro executor, with oracle EFS 89.69. Their scores were verified against per-instance evaluation records and converted to the page's 0–100 scale. Track B uses Component-F1, and NIU uses the full-precision dataset-level oracle mean. The paper PDF retains its original 17-model scope. The two Qwen names follow the official release announcement at https://qwen.ai/blog?id=qwen3.8-omni-flash.

Keep benchmark counts and metric definitions consistent with the paper, and identify additional leaderboard evaluations separately. Lato's license is included in `assets/fonts/LICENSE.txt`.
