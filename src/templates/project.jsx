import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import styled from "@emotion/styled"
import colors from "styles/colors"
import { Link, graphql } from "gatsby"
import { RichText } from "prismic-reactjs"
import Button from "components/_ui/Button"
import Layout from "components/Layout"
import Circle from "components/Circle"
import LinkItem from "components/LinkItem"
import Close from "components/Close"
import TwoGrid from "components/ImageGrid2"
import OneGrid from "components/ImageGrid1"
import FourGrid from "components/ImageGrid4"
const ProjectHeroContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
  position: relative;
  padding-top: 2.5em;

  img {
    max-width: 100%;
  }
`

const Date = styled("h3")`
  padding: 0 0.25rem 0 0.25rem;
  margin: 0;

  display: inline-block;
`

const Additional = styled("div")`
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    padding-bottom: 2rem;
    text-align: left;
  }
`

const Links = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
  padding-bottom: 2rem;
  text-align: left;
`

const TextContainer = styled("div")`
  padding: 7.5rem 0 7.5rem 0;
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
  display: inline;
`

const ProjectBody = styled("div")`
  .block-img {
    margin-top: 3.5em;
    margin-bottom: 0.5em;

    img {
      width: 100%;
    }
  }
`

const WorkLink = styled(Link)`
  margin-top: 3em;
  display: block;
  text-align: center;
`
const Project = ({ project, meta }) => {
  console.log("everything" + JSON.stringify(project.body))
  project.body.map(item => console.log("item" + item))
  return (
    <>
      <Helmet
        title={`${project.project_title[0].text} | Prist, Gatsby & Prismic Starter`}
        titleTemplate={`%s | ${meta.title}`}
        meta={[
          {
            name: `description`,
            content: meta.description,
          },
          {
            property: `og:title`,
            content: `${project.project_title[0].text} | Prist, Gatsby & Prismic Starter`,
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
      <Layout>
        <Container>
          <Grid>
            <div style={{ gridColumn: "1/span 2" }}>
              <Circle category={project.project_category} />
              <Date>{project.project_post_date.substring(0, 4)}</Date>
            </div>
            <div style={{ gridColumn: "11/span 2" }}>
              <Description>Challenge</Description>
            </div>
            <div style={{ gridColumn: "1/span 4" }}>
              <ProjectTitle>{project.project_title[0].text}</ProjectTitle>
            </div>
            <div style={{ gridColumn: "11/span 10" }}>
              <Challenge>{project.challenge[0].text}</Challenge>
            </div>{" "}
          </Grid>

          {project.project_preview_thumbnail && (
            <ProjectHeroContainer>
              <img src={project.project_preview_thumbnail.url} alt="bees" />
            </ProjectHeroContainer>
          )}
          <TextContainer>
            <Close />
            <Grid>
              <div style={{ gridColumn: "1/span 5" }}>
                <Description>Outcome</Description>
              </div>
              <div style={{ gridColumn: "7/span 2" }}>
                <Description>Additional</Description>
              </div>
              <div style={{ gridColumn: "11/span 10" }}>
                <Description>Details</Description>
              </div>
              <div style={{ gridColumn: "1/span 5" }}>
                {project.outcome[0].text}
              </div>
              <div style={{ gridColumn: "7/span 3" }}>
                <Additional>
                  {RichText.render(project.additional_info)}
                </Additional>
                <Description>Links</Description>
                <Links>
                  {project.links.map((link, i) =>
                    link.type === "list-item" ? (
                      <li>
                        <LinkItem href={link.spans[0].data.url}>
                          {link.text}
                        </LinkItem>
                      </li>
                    ) : null
                  )}
                </Links>
              </div>
              <div style={{ gridColumn: "11/span 10" }}>
                {project.project_details[0].text}
              </div>
            </Grid>
          </TextContainer>
          {project.body.map((item, i) => (
            <>
              {item.type === "2_grid" && (
                <TwoGrid
                  left_image={item.primary.left_image}
                  right_image={item.primary.right_image}
                />
              )}
              {item.type === "4_grid" && (
                <FourGrid
                  left_left={item.primary.left_left}
                  left_center={item.primary.left_center}
                  center_right={item.primary.center_right}
                  right_right={item.primary.right_right}
                />
              )}
              {item.type === "full_screen_image" && (
                <OneGrid image={item.primary.full} />
              )}
            </>
          ))}
        </Container>
      </Layout>
    </>
  )
}

export default ({ data }) => {
  const projectContent = data.prismic.allProjects.edges[0].node
  const meta = data.site.siteMetadata
  return <Project project={projectContent} meta={meta} />
}

Project.propTypes = {
  project: PropTypes.object.isRequired,
}

export const query = graphql`
  query ProjectQuery($uid: String) {
    prismic {
      allProjects(uid: $uid) {
        edges {
          node {
            body {
              ... on PRISMIC_ProjectBody2_grid {
                type
                primary {
                  left_image
                  left_caption
                  right_image
                  right_caption
                }
              }
              ... on PRISMIC_ProjectBody4_grid {
                type
                primary {
                  left_left
                  left_center
                  center_right
                  right_right
                  left_left_caption
                  left_center_caption
                  center_right_caption
                  right_right_caption
                }
              }
              ... on PRISMIC_ProjectBodyFull_screen_image {
                type
                primary {
                  full
                  full_caption
                }
              }
              __typename
            }
            completed
            featured_project
            project_title
            project_category
            project_preview_thumbnail
            video_link
            challenge
            outcome
            additional_info
            links
            project_details
            project_post_date
            _meta {
              uid
            }
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
