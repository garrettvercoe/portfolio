import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { RichText } from "prismic-reactjs"
import { graphql, Link } from "gatsby"
import styled from "@emotion/styled"
import colors from "styles/colors"
import Footer from "components/Footer"
import dimensions from "styles/dimensions"
import Layout from "components/Layout"
import ProjectGrid from "components/ProjectGrid"
import Header from "components/Header"
import Circle from "components/Circle"
import HorizontalScroll from "react-scroll-horizontal"
import ListGrid from "components/ListGrid"
import Close from "components/Close"
import LinkItem from "components/LinkItem"
import "styles/projectShowcase.scss"

const Date = styled("h3")`
  padding: 0 0.25rem 0 0.25rem;
  margin: 0;

  display: inline-block;
`

const Links = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
  padding-bottom: 2rem;
  text-align: left;
`
const ProjectCardImageContainer = styled("div")`
  display: flex;
  justify-content: left;
  align-items: flex-end;
  overflow: hidden;
  position: relative;
  padding-bottom: 1.5rem;
  max-width: 100%;

  @media (max-width: ${dimensions.maxwidthTablet}px) {
    padding-top: 3em;
    max-height: 200px;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  img {
    width: 100%;
    height: auto;
    @media (max-width: ${dimensions.maxwidthTablet}px) {
      max-width: 300px;
    }
  }
`
const TextContainer = styled("div")`
  padding: 5rem 0 0rem 0;
`
const ProjectTitle = styled("h1")`
  margin: 0 auto;
  padding-top: 0.25rem;
  font-size: 2.5em;
`

const Container = styled("div")`
  margin: 0 auto;
  padding: 2rem 10.75vw 10em 10.75vw;
`
const Grid = styled("div")`
  display: grid;
  grid-template-columns: repeat(20, 1fr);
`

const Description = styled("div")`
  font-size: 0.875rem;
  padding-bottom: 0.5rem;
  color: ${colors.grey600};
`

const Challenge = styled("h3")`
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 1.5em;
  display: inline;
`

const RenderBody = ({ home, meta }) => (
  <>
    <Helmet
      title={meta.title}
      titleTemplate={`%s | ${meta.title}`}
      meta={[
        {
          name: `description`,
          content: meta.description,
        },
        {
          property: `og:title`,
          content: meta.title,
        },
        {
          property: `og:description`,
          content: meta.description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: meta.author,
        },
        {
          name: `twitter:title`,
          content: meta.title,
        },
        {
          name: `twitter:description`,
          content: meta.description,
        },
      ].concat(meta)}
    />
    <Container>
      <Close />
      <Grid>
        <div style={{ gridColumn: "1/span 4" }}>
          <Circle category={"Person"} />
          <Date>1998</Date>
        </div>
        <div style={{ gridColumn: "11/span 2" }}>
          <Description>Challenge</Description>
        </div>
        <div style={{ gridColumn: "1/span 9" }}>
          <ProjectTitle>{home.title[0].text}</ProjectTitle>
        </div>
        <div style={{ gridColumn: "11/span 10" }}>
          <Challenge>{home.challenge[0].text}</Challenge>
        </div>{" "}
      </Grid>
      <TextContainer>
        <Grid>
          <div style={{ gridColumn: "1/span 5" }}>
            {" "}
            <Description>Photos</Description>
          </div>
          <div style={{ gridColumn: "7/span 3" }}>
            <Description>Links</Description>
          </div>

          <div style={{ gridColumn: "11/span 10" }}>
            <Description>Details</Description>
          </div>
          <div style={{ gridColumn: "1/span 5" }}>
            {home.body[0].fields.map((item, i) => (
              <ProjectCardImageContainer>
                <img src={item.gallery_image.url} />
              </ProjectCardImageContainer>
            ))}
          </div>
          <div style={{ gridColumn: "7/span 3" }}>
            <Links>
              {home.links.map((link, i) =>
                link.type === "list-item" ? (
                  <li>
                    <LinkItem href={link.spans[0].data.url}>
                      {link.text}
                    </LinkItem>
                  </li>
                ) : null
              )}
            </Links>
            <Description>What I Do</Description>
            <Links>
              {home.services.map((service, i) => (
                <div>{service.text}</div>
              ))}
            </Links>
            <Description>Recognitions</Description>
            <Links>
              {home.recognitions.map((recognition, i) => (
                <div>{recognition.text}</div>
              ))}
            </Links>
            <Description>Hobbies</Description>
            <Links>
              {home.hobbies.map((hobby, i) => (
                <div>{hobby.text}</div>
              ))}
            </Links>
          </div>
          <div
            style={{
              gridColumn: "11/span 10",
              fontSize: "1.5em",
              lineHeight: 1.5,
            }}
          >
            {RichText.render(home.info)}
          </div>
        </Grid>
      </TextContainer>
    </Container>
  </>
  //  <ListYear categories={categories} projects={projects} />
)

export default ({ data }) => {
  //Required check for no data being returned
  const doc = data.prismic.allHomepages.edges.slice(0, 1).pop()

  const meta = data.site.siteMetadata

  // let categories = projects.map(project => project.node.project_category)
  // const categoriesSet = new Set(categories)
  // const categoriesUnique = [...categoriesSet]

  if (!doc) return null

  return (
    <Layout>
      <RenderBody home={doc.node} meta={meta} />
    </Layout>
  )
}

RenderBody.propTypes = {
  home: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
}

export const query = graphql`
  {
    prismic {
      allHomepages {
        edges {
          node {
            body {
              ... on PRISMIC_HomepageBodyImage_gallery {
                type
                fields {
                  gallery_image
                }
              }
            }
            title
            challenge
            info
            hobbies
            links
            recognitions
            services
          }
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`