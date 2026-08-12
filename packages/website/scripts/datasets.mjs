/**
 * The SNAP datasets (https://snap.stanford.edu/data/) used by the
 * "fa2-gpu-datasets" example. Shared by the example itself and by
 * scripts/fetch-datasets.mjs, which downloads the files into public/data/.
 *
 * This file also acts as the CI cache manifest: the workflow keys its cache
 * of public/data/ on a hash of this file, so editing the dataset list below
 * invalidates the cache and triggers a fresh download.
 *
 * Label counts describe the merged undirected graph the example builds,
 * not SNAP's raw directed stats.
 */
export const DATASETS = {
  "ca-grqc": {
    label: "Arxiv GR-QC co-authorships (5.2k nodes, 14.5k edges)",
    file: "ca-GrQc.txt.gz",
  },
  "wiki-vote": {
    label: "Wikipedia adminship votes (7.1k nodes, 101k edges)",
    file: "wiki-Vote.txt.gz",
  },
  "ca-astroph": {
    label: "Arxiv Astro Physics co-authorships (18.8k nodes, 198k edges)",
    file: "ca-AstroPh.txt.gz",
  },
  "email-enron": {
    label: "Enron emails (36.7k nodes, 184k edges)",
    file: "email-Enron.txt.gz",
  },
  "soc-epinions": {
    label: "Epinions social network (75.9k nodes, 406k edges)",
    file: "soc-Epinions1.txt.gz",
  },
  amazon0302: {
    label: "Amazon co-purchases (262k nodes, 900k edges)",
    file: "amazon0302.txt.gz",
  },
  "web-notredame": {
    label: "Notre Dame web pages (326k nodes, 1.1M edges)",
    file: "web-NotreDame.txt.gz",
  },
  "web-stanford": {
    label: "Stanford web pages (282k nodes, 2M edges)",
    file: "web-Stanford.txt.gz",
  },
};
