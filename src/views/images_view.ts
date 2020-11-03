import OrphanageImages from '../models/OrphanageImages'

export default {
  render(image: OrphanageImages) {
    return {
      id: image.id,
      url: `${process.env.API_URL}${process.env.STORAGE_URL}${image.path}`,
    }
  },

  renderMany(images: OrphanageImages[]) {
    return images.map(image => this.render(image))
  }
}