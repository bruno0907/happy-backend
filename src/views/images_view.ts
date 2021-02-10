import OrphanageImages from '../models/OrphanageImages'

export default {
  render(image: OrphanageImages) {
    return {
      id: image.id,
      // url: `${process.env.API_URL}${process.env.STORAGE_URL}${image.path}`,
      url: `https://res.cloudinary.com/bruno0907storage/image/upload/v1612998592/${image.path}`
    }
  },

  renderMany(images: OrphanageImages[]) {
    return images.map(image => this.render(image))
  }
}