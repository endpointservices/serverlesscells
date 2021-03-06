// Collections, must be plural (http://apistylebook.com/design/guidelines/google-api-design-guide)
export const pattern = '(/regions/:region)?(/mods/:mods)?(/secrets/:secretids)?(/cells/:cellids)?(/notebooks/:namespace/:notebook)(/deployments/:deploy|/deploys/:deploy)?(/mods/:mods)?(/secrets/:secretids)?(/cells/:cellids)?(/:user(*))?';
export function decode(req) {
    let query = ''
    let secretKeys = req.params.secretids ? (req.params.secretids).split(",").map(decodeURIComponent): [];
    let userURL = "/" + (req.params.user || '');
    let baseURL = req.params.user ? 
        req.url.substring(0, req.url.length - userURL.length)
        : req.url
    if (req.params.cellids) {
        query = '?' + req.params.cellids.split(",").map(name => `cell=${name}`).join("&")
    }
    
    const notebookURL = (req.params.namespace == 'd' || req.params.namespace == 'thumbnail' 
        ? `https://observablehq.com/embed/${req.params.notebook}${query}`
        : `https://observablehq.com/embed/${req.params.namespace}/${req.params.notebook}${query}`);

    return {
        shard: `${req.params.namespace}/${req.params.notebook}`,
        notebookURL: notebookURL,
        baseURL: baseURL,
        userURL: userURL,
        notebook: req.params.notebook,
        secretKeys: secretKeys,
        deploy: req.params.deploy || 'default',
        hasMods: req.params.mods ? true : false,
        isExternal: req.params.mods ? req.params.mods.includes("X") : undefined,  // Cannot be called by other serverless cels
        isTerminal: req.params.mods ? req.params.mods.includes("T") : undefined,  // Cannot call other serverless cells 
        isOrchestrator: req.params.mods ? req.params.mods.includes("O") : undefined
    };
}