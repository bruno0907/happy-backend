import OrphanageImages from '../models/OrphanageImages'

export default {
  render(image: OrphanageImages) {
    return {
      id: image.id,
      url: `http://localhost:3333/uploads/${image.path}`,
    }
  },

  renderMany(images: OrphanageImages[]) {
    return images.map(image => this.render(image))
  }
}