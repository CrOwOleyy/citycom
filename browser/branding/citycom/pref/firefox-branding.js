/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This file contains branding-specific prefs.

pref("startup.homepage_override_url", "");
pref("startup.homepage_welcome_url", "");
pref("startup.homepage_welcome_url.additional", "");
// The time interval between checks for a new version (in seconds)
pref("app.update.interval", 86400); // 24 hours
// Give the user x seconds to react before showing the big UI. default=24 hours
pref("app.update.promptWaitTime", 86400);
// URL user can browse to manually if for some reason all update installation
// attempts fail.
pref("app.update.url.manual", "https://nightly.mozilla.org");
// A default value for the "More information about this update" link
// supplied in the "An update is available" page of the update wizard.
pref("app.update.url.details", "https://nightly.mozilla.org");

// The number of days a binary is permitted to be old
// without checking for an update.  This assumes that
// app.update.checkInstallTime is true.
pref("app.update.checkInstallTime.days", 2);

// Give the user x seconds to reboot before showing a badge on the hamburger
// button. default=immediately
pref("app.update.badgeWaitTime", 0);

// Number of usages of the web console.
// If this is less than 5, then pasting code into the web console is disabled
pref("devtools.selfxss.count", 5);

// CityCom: langue (retombe sur en-US si le francais n'est pas installe)
pref("intl.locale.requested", "fr,en-US");
// Le pack de langue francais est genere localement, donc non signe.
pref("extensions.langpacks.signatures.required", false);

// CityCom: apparence
pref("extensions.activeThemeID", "citycom-dark@citycom");
pref("browser.aboutwelcome.enabled", false);
pref("browser.shell.checkDefaultBrowser", false);

// CityCom: page d'accueil et nouvel onglet
pref("browser.newtabpage.customPageURL", "chrome://branding/content/home/home.html");
// about:home and about:newtab are separate origins with separate storage, so
// use about:newtab everywhere to share one set of shortcuts.
pref("browser.startup.homepage", "about:newtab");
pref("browser.startup.homepage.abouthome_cache.enabled", false);
pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
pref("browser.newtabpage.activity-stream.feeds.topsites", false);
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
pref("browser.newtabpage.activity-stream.telemetry", false);
pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
pref("browser.discovery.enabled", false);

// CityCom: moins de taches de fond (telemetrie, etudes)
pref("datareporting.healthreport.uploadEnabled", false);
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("toolkit.telemetry.unified", false);
pref("app.shield.optoutstudies.enabled", false);
pref("app.normandy.enabled", false);

// CityCom: fluidite
pref("general.smoothScroll.msdPhysics.enabled", true);
pref("gfx.canvas.accelerated.cache-size", 512);
pref("gfx.content.skia-font-cache-size", 20);
pref("image.mem.decode_bytes_at_a_time", 65536);
pref("browser.cache.memory.capacity", 262144);
pref("media.memory_cache_max_size", 131072);
pref("browser.sessionstore.interval", 60000);
pref("network.http.max-connections", 1800);
pref("network.http.max-persistent-connections-per-server", 10);
pref("network.http.pacing.requests.enabled", false);
pref("network.dnsCacheExpiration", 3600);
pref("network.ssl_tokens_cache_capacity", 10240);
pref("browser.tabs.unloadOnLowMemory", true);
