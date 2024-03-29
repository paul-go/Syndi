
namespace Syndi
{
	/**
	 * Returns an array of remote <section> elements that exist underneath
	 * the specified container element. Defaults to the <body> element in the
	 * current document if the container argument is omitted.
	 */
	export function getRemoteSectionElements(container: ParentNode = document.body)
	{
		return getElements("SECTION[src], SECTION[data-src]", container);
	}
	
	/**
	 * Returns a fully-qualified version of the URI specified as the source
	 * of the content in a <section> element.
	 */
	export function getRemoteSectionSource(
		section: HTMLElement,
		documentUrl = Url.getCurrent())
	{
		const src = section.getAttribute("src") || section.getAttribute("data-src") || "";
		return src ? Url.resolve(src, documentUrl) : "";
	}
	
	/**
	 * Loads the content of any remote <section> elements
	 * defined within the specified container element.
	 */
	export async function resolveRemoteSections(
		container: ParentNode = document,
		documentUrl = Url.getCurrent())
	{
		const remoteSections = Syndi.getRemoteSectionElements(container);
		for (const remoteSection of remoteSections)
		{
			block:
			{
				const remoteUrl = Syndi.getRemoteSectionSource(remoteSection, documentUrl);
				if (!remoteUrl)
					break block;
				
				const poster = await Syndi.getPosterFromUrl(remoteUrl);
				if (!poster)
					break block;
				
				remoteSection.replaceWith(poster);
				continue;
			}
			
			remoteSection.remove();
		}
	}
}
