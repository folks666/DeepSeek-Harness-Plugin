window.__ModuleLoader__.load({
	id: "dsh-deepseek-theme",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const React = require("react");
		const h = React.createElement;

		//#region palette
		/**
		 * DeepSeek Chat's brand blue. One constant, because the tile, the palette
		 * and the accent all read from the same value.
		 */
		const BRAND = "#4d6bfe";
		/** The layer identity this plugin owns in the theme override stack. */
		const TOKEN_SOURCE = "dsh-deepseek-theme";

		/**
		 * DeepSeek Chat's palette expressed as theme alias tokens.
		 *
		 * Every entry is a `{ light, dark }` pair: the theme service composes the
		 * layer into the active snapshot and the layout presenter writes the pair
		 * member that matches the current scheme onto `body`, so switching
		 * light/dark needs no work here and disabling the plugin retracts the whole
		 * layer at once.
		 *
		 * The set is deliberately semantic rather than exhaustive: the shipped
		 * neutral ramp already matches DeepSeek's, so only the surfaces that carry
		 * the blue identity move — the brand accent, the selected/hover tints, the
		 * sidebar and the conversation's bubble, composer and code fills.
		 */
		const TOKENS = {
			/* Page surfaces: white canvas in light, cool near-black in dark. */
			"--dsw-alias-bg-base": { light: "#ffffff", dark: "#17181c" },
			"--dsw-alias-bg-layer-1": { light: "#ffffff", dark: "#22242a" },
			"--dsw-alias-bg-layer-2": { light: "#ffffff", dark: "#272930" },
			"--dsw-alias-bg-layer-3": { light: "#f7f9fc", dark: "#2c2f36" },
			"--dsw-alias-bg-overlay": { light: "#ffffff", dark: "#2e3138" },

			/* Brand accent: primary buttons, switches, checkboxes, selection. */
			"--dsw-alias-brand-primary": { light: BRAND, dark: BRAND },
			"--dsw-alias-brand-primary-new-colorprimary-new-color": {
				light: BRAND,
				dark: "#7a96ff"
			},
			"--dsw-alias-button-primary-fill": { light: BRAND, dark: BRAND },
			"--dsw-alias-button-primary-hover": { light: "#3b57e8", dark: "#5b78ff" },
			/* Text sitting on the brand fill; both schemes now paint it blue. */
			"--dsw-alias-label-primary-foreground": { light: "#ffffff", dark: "#ffffff" },

			/* Links, focus rings and the "business" busy/selected state. */
			"--dsw-alias-state-business-primary": { light: BRAND, dark: "#7a96ff" },
			"--dsw-alias-state-business-tertiary": { light: "#e4edff", dark: "#26314f" },
			"--dsw-alias-link": { light: BRAND, dark: "#7a96ff" },
			"--dsw-alias-button-info-fill": { light: BRAND, dark: "#7a96ff" },
			"--dsw-alias-button-info-hover": { light: "#3b57e8", dark: "#5b78ff" },

			/* Hover/active washes keep a blue cast instead of a neutral gray one. */
			"--dsw-alias-interactive-bg-hover": { light: "#263a8f0f", dark: "#ffffff14" },
			"--dsw-alias-interactive-bg-active": { light: "#263a8f1f", dark: "#ffffff24" },
			"--dsw-alias-interactive-bg-hover-solid": { light: "#f1f5ff", dark: "#24262c" },
			"--dsw-alias-bg-module-platform": { light: "#f4f7fd", dark: "#24262c" },

			/* Sidebar: the pale blue column and its row states. */
			"--dsw-specific-sidebar-fill": { light: "#f7f9fe", dark: "#1b1d22" },
			"--dsw-specific-sidebar-nav-item-active": { light: "#e9effb", dark: "#2c313c" },
			"--dsw-specific-sidebar-nav-item-active-accent": { light: "#dbe6ff", dark: "#343b4c" },
			"--dsw-specific-sidebar-nav-item-hover": { light: "#f1f5fc", dark: "#23252b" },

			/* Conversation: user bubble, match highlight and the composer card. */
			"--dsw-specific-bubble": { light: "#eaf1ff", dark: "#2a2d35" },
			"--dsw-specific-bubble-highlight": { light: "#d7e3ff", dark: "#3b4050" },
			"--dsw-specific-input-major": { light: "#ffffff", dark: "#23252b" },

			/* Code: block, its banner and inline code. */
			"--dsw-alias-markdown-code-block": { light: "#f6f8fb", dark: "#1b1d22" },
			"--dsw-alias-markdown-code-block-banner": { light: "#f0f3f9", dark: "#24262c" },
			"--dsw-alias-markdown-inline-code": { light: "#f1f4f9", dark: "#2a2c33" }
		};
		//#endregion

		//#region hero icon accents
		/**
		 * The two leading glyphs of the new-session row are host chrome, not slots,
		 * and both paint `--dsw-alias-label-primary` like every other control, so no
		 * token can tint them without tinting the whole UI. One scoped sheet does it
		 * instead, matching the CSS-module *name* part of the classes (the hash prefix
		 * differs per build) and only inside the hero row:
		 *
		 * - `_folder` is the workspace picker's folder glyph (`HeroShell.module.css`);
		 * - `_seatIcon` is the agent-preset chip's leading glyph
		 *   (`AgentPresetSeat.module.css`).
		 *
		 * Only `color` is set, so shape, size and layout stay exactly as shipped; the
		 * chevron classes (`_chevron`) are deliberately left alone. The two selectors
		 * outrank the single-class host rules, so no `!important` is needed.
		 */
		const ICON_CSS = [
			'[class*="heroWorkspaceRow"] [class*="_folder"]{color:var(--dsw-alias-brand-primary)}',
			'[class*="heroWorkspaceRow"] [class*="_seatIcon"]{color:var(--dsw-alias-brand-primary)}'
		].join("\n");
		//#endregion

		//#region brand marks
		/**
		 * Single slots accept one occupant per priority, and the lowest priority
		 * renders. The shipped `ui-brand-official` package fills both sidebar seats
		 * at the default priority 0, so these registrations sit one step lower to
		 * shadow it; the hero seat is empty today and is shadowed the same way for
		 * consistency. Disposing the registration — disabling the plugin — hands the
		 * seats straight back to the official occupants.
		 */
		const PRIORITY = -1;

		/**
		 * The published DeepSeek whale glyph.
		 *
		 * Taken verbatim from the brand icon published for DeepSeek (Simple Icons'
		 * `deepseek` entry, CC0 1.0; the mark itself remains a DeepSeek trademark),
		 * so the sidebar and the hero show the same whale as the official site instead
		 * of a redrawn approximation. The artwork is a single monochrome silhouette,
		 * so the only decision left here is the fill: DeepSeek's brand blue.
		 */
		const WHALE_PATH =
			"M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45";

		/**
		 * The whale mark, scaled to the square edge the seat asks for.
		 * @param size - requested square edge in px; the seats pass 24 (sidebar) and
		 * 34 (blank-session hero).
		 * @param className - host class the seat supplies, which carries the hero's
		 * swim animation origin.
		 */
		function whale(size, className) {
			const edge = typeof size === "number" && Number.isFinite(size) && size > 0 ? size : 24;
			return h(
				"svg",
				{
					className,
					width: edge,
					height: edge,
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					focusable: "false",
					style: { display: "block", flex: "none" }
				},
				h("path", { key: "whale", d: WHALE_PATH, fill: BRAND })
			);
		}

		/** Sidebar brand mark (expanded row and collapsed rail). */
		function SidebarMark(props) {
			return whale(props.size, props.className);
		}

		/** Blank-session hero mark; the seat's class keeps the host swim animation. */
		function HeroMark(props) {
			return whale(props.size, props.className);
		}
		//#endregion

		//#region plugin entry
		/** Required services (cordis fiber inject). */
		const inject = ["theme", "slots"];

		/**
		 * Mount the browser half.
		 *
		 * One token layer plus two brand seats, each owned by an effect so disabling
		 * the plugin restores the stock palette and marks. The sidebar brand *name*
		 * stays untouched on purpose: the official `ui-brand-official` occupant draws
		 * the real DeepSeek Harness wordmark there, which is artwork this plugin must
		 * not reproduce.
		 * @param ctx - the browser plugin context.
		 */
		function apply(ctx) {
			ctx.effect(
				() => ctx.theme.overrideTokens(TOKEN_SOURCE, TOKENS),
				"dsh-deepseek-theme: palette"
			);
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-deepseek-theme";
				tag.dataset.pluginCss = "dsh-deepseek-theme/hero-icons.css";
				tag.textContent = ICON_CSS;
				document.head.appendChild(tag);
				return () => tag.remove();
			}, "dsh-deepseek-theme: hero icon accents");
			ctx.slots.inject(
				"sidebar.brand.mark",
				() => ctx.slots.register({ name: "sidebar.brand.mark", priority: PRIORITY }, SidebarMark),
				"dsh-deepseek-theme: sidebar mark"
			);
			ctx.slots.inject(
				"conversation.hero.brand.mark",
				() =>
					ctx.slots.register(
						{ name: "conversation.hero.brand.mark", priority: PRIORITY },
						HeroMark
					),
				"dsh-deepseek-theme: hero mark"
			);
		}
		//#endregion

		exports.TOKENS = TOKENS;
		exports.SidebarMark = SidebarMark;
		exports.HeroMark = HeroMark;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
