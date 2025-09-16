exports.pageNotFound = (req, res, next) => {
    res.status(404).render("404", { 
        pageTitle: "404 Not Found",
        currentPage: '' // Empty string as no nav item should be active on 404 page
    });
}
