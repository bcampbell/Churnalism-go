package controllers

import "github.com/robfig/revel"

type App struct {
	*revel.Controller
}

func (c App) Index() revel.Result {
	c.RenderArgs["stats"] = stats
	c.RenderArgs["article"] = PressRelease{}
	return c.RenderTemplate("App/Result.html")
}

func (c App) Result(id string) revel.Result {
	article := GetPressRelease(id)
	return c.Render(article, stats)
}

func (c App) Retrieve() revel.Result {
	return Stub(results)
}

func (c App) Suggest() revel.Result {
	return Stub(terms)
}

func (c App) Save() revel.Result {
	return Stub(results)
}

func (c App) Search() revel.Result {
	return Stub(results)
}

func (c App) Api() revel.Result {
	return c.Render()
}

func (c App) Explore() revel.Result {
	return c.Render()
}

func (c App) Browse() revel.Result {
	return Stub(browse)
}

func (c App) Examples() revel.Result {
	return c.Render()
}

func (c App) Faq() revel.Result {
	return c.Render()
}

func (c App) Contact() revel.Result {
	return c.Render()
}
